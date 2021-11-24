// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IMarketplace.sol";
import "./interfaces/IStakingContract.sol";

/**
 * @title An open marketplace, enabling collectors and curators to run their own auctions or normal listing
 */
contract Marketplace is Initializable, OwnableUpgradeable, ERC721HolderUpgradeable, ReentrancyGuardUpgradeable, IMarketplace {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // The minimum percentage difference between the last bid amount and the current bid.
    uint8 public minBidIncrementPercentage;

    // The sale percentage
    uint8 public feePercentage;

    // The address which will receive the fee
    address public vault;

    // The address of GameFi
    address public gamefi;

    IStakingContract.Ranking[] public rankings;

    // Mapping from id to the currently running auctions
    mapping(uint256 => IMarketplace.Auction) public auctions;

    // A mapping of all of the auctions currently running. auctionId -> sender -> amount
    mapping(uint256 => mapping(address => uint256)) public tokenBids;

    bytes4 constant interfaceId = 0x80ac58cd; // 721 interface id

    CountersUpgradeable.Counter private _auctionIdTracker;

    // A mapping from NFT address to accepted currency.
    // Used to limit NFT - currency pair on the marketplace
    mapping(address => mapping(address => bool)) public allowedCurrency;
    mapping(address => bool) public defaultCurrency;

    // A mapping from NFT token to its listing information
    mapping(address => mapping(uint256 => IMarketplace.ListingToken)) public tokensOnSale;

    // A mapping from NFT token to buyers' offer
    mapping(address => mapping(uint256 => mapping(address => IMarketplace.Offer))) public tokensWithOffers;

    /**
     * @notice Require that the specified auction exists
     */
    modifier auctionExists(uint256 auctionId) {
        require(auctions[auctionId].tokenOwner != address(0), "Auction doesn't exist");
        _;
    }

    /*
     * Constructor
     */
    function __Marketplace_init(
        address _vault
    ) public initializer {
        __Ownable_init();
        vault = _vault;
        minBidIncrementPercentage = 5;
        feePercentage = 1;
        defaultCurrency[address(0)] = true;
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the auctions mapping and emit an AuctionCreated event.
     * If there is no curator, or if the curator is the auction creator, automatically approve the auction.
     */
    function createAuction(
        uint256 tokenId,
        address tokenContract,
        uint256 duration,
        uint256 reservePrice,
        address auctionCurrency
    ) public override nonReentrant returns (uint256) {
        require(_isValidCurrency(tokenContract, auctionCurrency), "Invalid currency");
        uint auctionId = _createAuction(tokenId, tokenContract, duration, reservePrice, auctionCurrency);
        return auctionId;
    }

    /**
     * @notice Create a bid on a token, with a given amount.
     * @dev If provided a valid bid, transfers the provided amount to this contract.
     * If the auction is run in native ETH, the ETH is wrapped so it can be identically to other
     * auction currencies in this contract.
     */
    function createBid(uint256 auctionId, uint256 amount)
    external
    override
    payable
    auctionExists(auctionId)
    nonReentrant
    {
        address lastBidder = auctions[auctionId].bidder;
        require(
            block.timestamp < auctions[auctionId].endTime,
            "Auction expired"
        );
        require(
            amount >= auctions[auctionId].reservePrice,
            "Must send at least reservePrice"
        );
        require(
            amount >= auctions[auctionId].amount + (
                auctions[auctionId].amount * minBidIncrementPercentage / 100
            ),
            "Must send more than last bid by minBidIncrementPercentage amount"
        );
            
        if(lastBidder != address(0)) {
            _handleOutgoingFund(lastBidder, auctions[auctionId].amount, auctions[auctionId].auctionCurrency);
            emit AuctionBidCanceled(
                auctionId,
                auctions[auctionId].tokenId,
                auctions[auctionId].tokenContract,
                lastBidder,
                amount
            );
        }

        _handleIncomingFund(amount, auctions[auctionId].auctionCurrency);
        auctions[auctionId].amount = amount;
        auctions[auctionId].bidder = msg.sender;

        emit AuctionBid(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].tokenContract,
            msg.sender,
            amount,
            lastBidder == address(0)
        );
    }

    function list(
        uint256 tokenId,
        address tokenContract,
        uint256 price,
        address currency
    ) external nonReentrant {
        require(_isValidCurrency(tokenContract, currency), "Invalid currency");
        address tokenOwner = IERC721Upgradeable(tokenContract).ownerOf(tokenId);
        require(msg.sender == tokenOwner, "Not token owner");

        IERC721Upgradeable(tokenContract).safeTransferFrom(tokenOwner, address(this), tokenId);
        tokensOnSale[tokenContract][tokenId] = ListingToken({
            tokenOwner: tokenOwner,
            currency: currency,
            price: price
        });

        emit TokenListed(tokenContract, tokenId, tokenOwner, currency, price);
    }

    function delist(
        uint256 tokenId, 
        address tokenContract
    ) external {
        ListingToken storage currentListing = tokensOnSale[tokenContract][tokenId];

        require(currentListing.price > 0, "Not listed");
        require(msg.sender == currentListing.tokenOwner, "Not token owner");

        IERC721Upgradeable(tokenContract).safeTransferFrom(address(this), currentListing.tokenOwner, tokenId);
        emit TokenDelisted(tokenContract, tokenId, currentListing.tokenOwner);
       
        delete tokensOnSale[tokenContract][tokenId];
    }

    function buy(
        uint256 tokenId,
        address tokenContract,
        uint256 price,
        address currency
    ) external payable nonReentrant {
        require(_isValidCurrency(tokenContract, currency), "Invalid currency");
        ListingToken storage currentListing = tokensOnSale[tokenContract][tokenId];

        address buyer = msg.sender;
        address seller = currentListing.tokenOwner;

        require(currency == currentListing.currency, "Invalid currency");
        require(price > 0 && price == currentListing.price, "Invalid price");
        require(buyer != seller, "Cannot buy your own token");

        // We can't transfer native token from buyer to seller directly
        _handleIncomingFund(price, currency);

//        uint256 fee = price * feePercentage / 100;
        uint256 fee = calculateFee(seller, price);
        _handleOutgoingFund(vault, fee, currency);

        uint256 sellerProfit = price - fee;
        _handleOutgoingFund(seller, sellerProfit, currency);

        IERC721Upgradeable(tokenContract).safeTransferFrom(address(this), buyer, tokenId);

        Offer storage currentOffer = tokensWithOffers[tokenContract][tokenId][buyer];
        if (currentOffer.amount > 0) {
            _handleOutgoingFund(buyer, currentOffer.amount, currentOffer.currency);
            delete tokensWithOffers[tokenContract][tokenId][buyer];
            emit TokenOfferCanceled(tokenContract, tokenId, buyer);
        }
        emit TokenBought(tokenContract, tokenId, buyer, seller, currency, price);
    }

    function offer(
        uint256 tokenId,
        address tokenContract,
        uint256 offerValue,
        address currency
    ) external nonReentrant payable {
        require(tokensOnSale[tokenContract][tokenId].tokenOwner != address(0), "Token must be listed");
        require(_isValidCurrency(tokenContract, currency), "Invalid currency");

        address buyer = msg.sender;
        address tokenOwner = IERC721Upgradeable(tokenContract).ownerOf(tokenId);
        require(buyer != tokenOwner, "Owner cannot offer");

        Offer storage currentOffer = tokensWithOffers[tokenContract][tokenId][buyer];

        if (currency != currentOffer.currency && currentOffer.amount > 0) {
            _handleOutgoingFund(buyer, currentOffer.amount, currentOffer.currency);
            currentOffer.amount = 0;
        }

        if (currency == currentOffer.currency) {
            require(offerValue != currentOffer.amount, "Same offer");
        }

        bool needRefund = offerValue < currentOffer.amount;
        uint256 requiredValue = needRefund ? currentOffer.amount - offerValue : offerValue - currentOffer.amount;
        if (needRefund) {
            _handleOutgoingFund(buyer, requiredValue, currentOffer.currency);
        } else {
            _handleIncomingFund(requiredValue, currency);
        }

        tokensWithOffers[tokenContract][tokenId][buyer] = Offer({
            currency: currency,
            amount: offerValue
        });

        emit TokenOffered(tokenContract, tokenId, buyer, currency, offerValue);
    }

    function takeOffer(
        uint256 tokenId,
        address tokenContract,
        uint256 amount,
        address currency,
        address buyer
    ) external nonReentrant {
        require(_isValidCurrency(tokenContract, currency), "Invalid currency");

        Offer memory currentOffer = tokensWithOffers[tokenContract][tokenId][buyer];
        ListingToken memory currentListing = tokensOnSale[tokenContract][tokenId];

        address tokenOwner = IERC721Upgradeable(tokenContract).ownerOf(tokenId);
        address seller = msg.sender;

        require(seller == tokenOwner || seller == currentListing.tokenOwner, "Not token owner");
        require(currency == currentOffer.currency, "Invalid currency");
        require(amount == currentOffer.amount, "Invalid amount");
        require(buyer != seller, "Cannot buy your own token");

//        uint256 fee = amount * feePercentage / 100;
        uint256 fee = calculateFee(seller, amount);
        _handleOutgoingFund(vault, fee, currency);

        uint256 sellerProfit = amount - fee;
        _handleOutgoingFund(seller, sellerProfit, currency);

        IERC721Upgradeable(tokenContract).safeTransferFrom(tokenOwner, buyer, tokenId);

        delete tokensOnSale[tokenContract][tokenId];
        delete tokensWithOffers[tokenContract][tokenId][buyer];

        emit TokenBought(tokenContract, tokenId, buyer, seller, currency, amount);
    }

    function cancelOffer(
        uint256 tokenId,
        address tokenContract
    ) external nonReentrant {
        address buyer = msg.sender;
        Offer storage currentOffer = tokensWithOffers[tokenContract][tokenId][buyer];

        require(currentOffer.amount > 0, "No offer found");

        _handleOutgoingFund(buyer, currentOffer.amount, currentOffer.currency);

        delete tokensWithOffers[tokenContract][tokenId][buyer];

        emit TokenOfferCanceled(tokenContract, tokenId, buyer);
    }

    function cancelBid(uint256 auctionId)
    external
    auctionExists(auctionId)
    nonReentrant
    {
        uint256 bid = tokenBids[auctionId][msg.sender];
        require(bid > 0, "Bid not exist");
        _handleOutgoingFund(msg.sender, bid, auctions[auctionId].auctionCurrency);
        delete tokenBids[auctionId][msg.sender];
    }

    /**
     * @notice End an auction, finalizing the bid if applicable and paying out the respective parties.
     * @dev If for some reason the auction cannot be finalized (invalid token recipient, for example),
     * The auction is reset and the NFT is transferred back to the auction creator.
     */
    function endAuction(uint256 auctionId) public override auctionExists(auctionId) nonReentrant {
        _endAuction(auctionId);
    }

    /**
     * @notice End an auction, finalizing the bid if applicable and paying out the respective parties.
     * @dev If for some reason the auction cannot be finalized (invalid token recipient, for example),
     * The auction is reset and the NFT is transferred back to the auction creator.
     */
    function _endAuction(uint256 auctionId) internal {
        Auction memory auctionInfo = auctions[auctionId];
        require(
            block.timestamp >= auctionInfo.endTime,
            "Auction hasn't completed"
        );

        address currency = auctionInfo.auctionCurrency;
        uint256 tokenOwnerProfit = auctionInfo.amount;

        try IERC721Upgradeable(auctionInfo.tokenContract).safeTransferFrom(address(this), auctionInfo.bidder, auctionInfo.tokenId) {} catch {
            _handleOutgoingFund(auctionInfo.bidder, auctionInfo.amount, auctionInfo.auctionCurrency);
            _cancelAuction(auctionId);
            return;
        }

        uint256 totalFee = tokenOwnerProfit * feePercentage / 100;
//        uint256 totalFee = calculateFee(auctionInfo.tokenOwner); tokenOwnerProfit * feePercentage / 100;
        _handleOutgoingFund(vault, totalFee, auctionInfo.auctionCurrency);

        tokenOwnerProfit -= totalFee;
        _handleOutgoingFund(auctionInfo.tokenOwner, tokenOwnerProfit, auctionInfo.auctionCurrency);

        emit AuctionEnded(
            auctionId,
            auctionInfo.tokenId,
            auctionInfo.tokenContract,
            auctionInfo.tokenOwner,
            auctionInfo.bidder,
            tokenOwnerProfit,
            currency
        );
        delete auctions[auctionId];
    }

    function setMinBidIncrementPercentage(uint8 _percentage) external nonReentrant onlyOwner {
        require(_percentage < 100);
        minBidIncrementPercentage = _percentage;
    }

    function setFeePercentage(uint8 _percentage) external nonReentrant onlyOwner {
        require(_percentage < 100);
        feePercentage = _percentage;
    }

    function setVault(address _vault) external nonReentrant onlyOwner {
        vault = _vault;
    }

    function setRankings(uint256[] memory threshold, uint256[] memory permile) external nonReentrant onlyOwner {
        require(threshold.length == permile.length, "Length must be the same");

        for (uint256 index = 0; index < threshold.length; index++) {
            if (rankings.length <= index) {
                rankings.push(IStakingContract.Ranking(threshold[index], permile[index]));
            } else {
                rankings[index].threshold = threshold[index];
                rankings[index].permile = permile[index];
            }
        }
    }

    function setDefaultCurrencyStatus(address currency, bool status) external nonReentrant onlyOwner {
        defaultCurrency[currency] = status;
    }

    function setTokenAllowedCurrency(address token, address currency, bool status) external nonReentrant onlyOwner {
        allowedCurrency[token][currency] = status;
    }

    function collectTokenAsFee(IERC20Upgradeable token, address dest, uint256 amount) external nonReentrant onlyOwner {
        token.safeTransfer(dest, amount);
    }

    function cancelAuction(uint256 auctionId) external override nonReentrant auctionExists(auctionId) {
        require(
            auctions[auctionId].tokenOwner == msg.sender,
            "Can only be called by auction creator"
        );
        require(
            uint256(auctions[auctionId].amount) == 0,
            "Can't cancel an auction once it's begun"
        );
        _cancelAuction(auctionId);
    }

    /**
     * @dev Given an amount and a currency, transfer the amount of currency to this contract.
     */
    function _handleIncomingFund(uint256 amount, address currency) internal {
        // If this is an ETH bid, ensure they sent enough
        if(currency == address(0)) {
            require(msg.value == amount, "Sent BNB Value does not match specified bid amount");
            (bool isSuccess,) = address(this).call{value: msg.value}("");
            require(isSuccess, "Transfer failed: gas error");
        } else {
            // We must check the balance that was actually transferred to the auction,
            // as some tokens impose a transfer fee and would not actually transfer the
            // full amount to the market, resulting in potentially locked funds
            IERC20Upgradeable token = IERC20Upgradeable(currency);
            uint256 beforeBalance = token.balanceOf(address(this));
            token.safeTransferFrom(msg.sender, address(this), amount);
            uint256 afterBalance = token.balanceOf(address(this));
            require(beforeBalance + amount == afterBalance, "Token transfer call did not transfer expected amount");
        }
    }

    /**
     * @dev Given a receiver, an amount and a currency, transfer the amount of currency from this contract to receiver.
     */
    function _handleOutgoingFund(address to, uint256 amount, address currency) internal {
        if(currency == address(0)) {
            (bool isSuccess,) = to.call{value: amount}("");
            require(isSuccess, "Transfer failed: gas error");
        } else {
            IERC20Upgradeable(currency).safeTransfer(to, amount);
        }
    }

    function _cancelAuction(uint256 auctionId) internal {
        address tokenOwner = auctions[auctionId].tokenOwner;
        IERC721Upgradeable(auctions[auctionId].tokenContract).safeTransferFrom(address(this), tokenOwner, auctions[auctionId].tokenId);

        emit AuctionCanceled(auctionId, auctions[auctionId].tokenId, auctions[auctionId].tokenContract, tokenOwner);
        delete auctions[auctionId];
    }

    function _createAuction(
        uint256 tokenId,
        address tokenContract,
        uint256 duration,
        uint256 reservePrice,
        address auctionCurrency
    ) internal returns (uint256) {
        require(
            IERC165Upgradeable(tokenContract).supportsInterface(interfaceId),
            "tokenContract does not support ERC721 interface"
        );
        require(
            reservePrice > 0,
            "ReservePrice need to be define!"
        );
        require(
            duration > 0,
            "Duration need to be defined!"
        );

        _auctionIdTracker.increment();
        address tokenOwner = IERC721Upgradeable(tokenContract).ownerOf(tokenId);
        require(msg.sender == IERC721Upgradeable(tokenContract).getApproved(tokenId) || msg.sender == tokenOwner, "Caller must be approved or owner for token id");
        uint256 auctionId = _auctionIdTracker.current();
        uint256 endTime = block.timestamp + duration;

        auctions[auctionId] = Auction({
            tokenId: tokenId,
            tokenContract: tokenContract,
            amount: 0,
            endTime: endTime,
            reservePrice: reservePrice,
            tokenOwner: tokenOwner,
            bidder: address(0),
            auctionCurrency: auctionCurrency
        });

        IERC721Upgradeable(tokenContract).safeTransferFrom(tokenOwner, address(this), tokenId);

        emit AuctionCreated(auctionId, tokenId, tokenContract, duration, reservePrice, tokenOwner, auctionCurrency);

        return auctionId;
    }

    function _isValidCurrency(
        address tokenContract,
        address currency
    ) public returns (bool) {
        if (defaultCurrency[currency] || allowedCurrency[tokenContract][currency]) {
            return true;
        }

        return false;
    }

    function calculateFee(
        address user, // who must pay fee
        uint256 amount
    ) public returns (uint256) {
        if (gamefi == address(0)) {
            return feePercentage * amount / 100;
        }

        uint256 points = IStakingContract(gamefi).points(user);
        uint256 fee = 0;
        for (uint256 index = 0; index < rankings.length; index++) {
            if (points >= rankings[index].threshold) {
                fee = rankings[index].permile;
            }
        }

        return fee * amount / 1000;
    }

    receive() external payable {}
    fallback() external payable {}
}
