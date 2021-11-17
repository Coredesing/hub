//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IExternalRandom {
    function requestRandomNumber(uint256 eventId) external returns (uint256, bool);
}

interface IExternalMinted {
    function mintTokens(address owner, uint count, uint group) external;
    function mintToken(address owner) external;
}

interface IStakingContract {
    function linearBalanceOf(uint256 _poolId, address _account) external returns (uint128);
}

contract GameFiBox is Initializable, OwnableUpgradeable, ERC721EnumerableUpgradeable, ERC721HolderUpgradeable {
    struct SaleEvent {
        uint256 currentSupply;
        uint256 maxSupply;
        uint256 startTime;
        uint256 endTime;
        uint256 maxPerBatch;
        address NFT;
        uint256 startNFTId;
        bool revealed;
        bool useSubEvent;
        uint256 startingIndex;
    }

    struct Box {
        uint256 id;
        uint256 nftId;
        uint256 eventId;
        uint256 subBoxId;
        bool revealed;
    }

    struct SubBox {
        uint256 id;
        uint256 maxSupply;
        uint256 totalSold;
        uint256 price;
        address token;
    }

    struct RandomEvent {
        uint256 eventId;
        bool isRequest;
        bool isFulFill;
    }

    struct ExternalStakingContract {
        address stakingAddress;
        uint256 discountPerMile; // per thousand
        uint256 threshold;
        uint256 poolId;
    }

    string public uri;
    uint256 public maxSupply;
    address public fundWallet;
    address public signer;
    address public externalRandom;
    address public externalMinted;
    bool public allowTransfer;
    mapping(uint256 => bool) public minted; // check nftId is minted for saleId
    mapping(uint256 => mapping(uint256 => SubBox)) public subBoxes;
    mapping(uint256 => mapping(address => uint256)) public userBought;
    mapping(address => uint256) superLimit; // for Legends
    SaleEvent[] public saleEvents;
    Box[] public boxes;
    ExternalStakingContract public externalStakingContract;

    event BoxCreated(uint256 indexed id);
    event NewSaleEventAdded(uint256 indexed id);
    event SaleEventTimeUpdated(uint256 id, uint256 startTime, uint256 endTime);
    event SaleEventPriceUpdated(uint256 id, uint256 price);
    event SaleEventRangeIdUpdated(uint256 id, uint256 startNFTId, uint256 maxSupply);
    event SaleEventNFTUpdated(uint256 id, address nft);
    event NFTClaimed(address indexed user, uint256 boxId, uint256 nftId);

    function __GameFiBox_init(
        string memory name,
        string memory symbol,
        string memory _uri,
        address _signer,
        address _fundWallet,
        address _externalRandom,
        address _externalMinted
    ) public initializer {
        __Ownable_init();
        ERC721Upgradeable.__ERC721_init(name, symbol);

        uri = _uri;
        signer = _signer;
        fundWallet = _fundWallet;
        externalRandom = _externalRandom;
        externalMinted = _externalMinted;
        allowTransfer = false;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        uri = baseURI;
    }

    function setExternalRandom(address _externalRandom) public onlyOwner {
        externalRandom = _externalRandom;
    }

    function setExternalStakingContract(address _externalStaking, uint256 _discountPerMile, uint256 _threshold, uint256 _poolId) public onlyOwner {
        externalStakingContract.stakingAddress = _externalStaking;
        externalStakingContract.discountPerMile = _discountPerMile;
        externalStakingContract.threshold = _threshold;
        externalStakingContract.poolId = _poolId;
    }

    function setExternalMinted(address _externalMinted) public onlyOwner {
        externalMinted = _externalMinted;
    }

    function setSigner(address _signer) public onlyOwner {
        require(_signer != address(0), "invalid signer");
        signer = _signer;
    }

    function setFundWallet(address _fundWallet) public onlyOwner {
        require(_fundWallet != address(0), "invalid contract");
        fundWallet = _fundWallet;
    }

    function setSubBox(uint256 eventID, uint256[] memory max, uint256[] memory prices, address[] memory tokens) public onlyOwner {
        for (uint256 index = 0; index < max.length; index++) {
            subBoxes[eventID][index] = SubBox(index, max[index], 0, prices[index], tokens[index]);
        }
    }

    function setAllowTransfer(bool allow) public onlyOwner {
        allowTransfer = allow;
    }

    function setSaleEventTime(
        uint256 id,
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner {
        SaleEvent storage saleEvent = saleEvents[id];
        saleEvent.startTime = startTime;
        saleEvent.endTime = endTime;
        emit SaleEventTimeUpdated(id, startTime, endTime);
    }

    function setSaleEventRangeId(
        uint256 id,
        uint256 startNFTId,
        uint256 _maxSupply
    ) external onlyOwner {
        require(_maxSupply > 0, "invalid number");

        SaleEvent storage saleEvent = saleEvents[id];
        saleEvent.startNFTId = startNFTId;
        saleEvent.maxSupply = _maxSupply;
        emit SaleEventRangeIdUpdated(id, startNFTId, maxSupply);
    }

    function setSaleEventAddress(
        uint256 id,
        address nft
    ) external onlyOwner {
        SaleEvent storage saleEvent = saleEvents[id];
        saleEvent.NFT = nft;
        emit SaleEventNFTUpdated(id, nft);
    }

    function setSuperLimit(
        address[] memory users,
        uint256 limit
    ) external onlyOwner {
        for (uint256 index = 0; index < users.length; index++) {
            superLimit[users[index]] = limit;
        }
    }

    function addSaleEvent(
        uint256 _maxSupply,
        uint256 startTime,
        uint256 endTime,
        uint256 maxPerBatch,
        address nft,
        uint256 startNFTId,
        bool useSubEvent
    ) external onlyOwner {
        require(_maxSupply > 0, "invalid number");

        if (saleEvents.length > 0) {
            SaleEvent memory latestSale = saleEvents[saleEvents.length - 1];
            require(latestSale.currentSupply == latestSale.maxSupply || block.timestamp > latestSale.endTime, "The current sale events has not sold out");
        }

        saleEvents.push(SaleEvent(0, _maxSupply, startTime, endTime, maxPerBatch, nft, startNFTId, false, useSubEvent, 0));
        emit NewSaleEventAdded(saleEvents.length);
    }

    function setRandomNumber(uint256 eventId, bytes32 requestId, uint256 randomness) external {
        require(msg.sender == externalRandom, "NFTBox: msg.sender is not valid");

        SaleEvent memory sale = saleEvents[eventId];
        require(sale.startTime > 0, "event not found");
        require(sale.currentSupply == sale.maxSupply || block.timestamp > sale.endTime, "The current sale events has not sold out");

        uint256 seed = randomness % sale.maxSupply;
        _linkAllBoxes(eventId, seed);
    }

    function randomEvent(uint256 eventId) public onlyOwner {
        SaleEvent storage sale = saleEvents[eventId];
        require(sale.startTime > 0, "event not found");
        require(sale.currentSupply == sale.maxSupply || block.timestamp > sale.endTime, "The current sale events has not sold out");
        require(!sale.revealed, "The current sale has random successfully");

        uint256 seed = 0;
        if (externalRandom != address(0)) {
            (uint256 randomness, bool isOk) = IExternalRandom(externalRandom).requestRandomNumber(eventId);
            if (!isOk) {
                return;
            }
            seed = randomness % sale.maxSupply;
        } else {
            seed = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, eventId))) % sale.maxSupply;
        }

        _linkAllBoxes(eventId, seed);
    }

    function claimBox(uint256 eventId, address token, uint256 amount, uint256 subBoxId, bytes memory signature) public payable {
        SaleEvent storage sale = saleEvents[eventId];
        if (superLimit[msg.sender] > 0) {
            require(amount > 0 && amount + userBought[eventId][msg.sender] <= superLimit[msg.sender], "NFTBox: Legends Rate limit exceeded");
        } else {
            require(amount > 0 && amount + userBought[eventId][msg.sender] <= sale.maxPerBatch, "NFTBox: Rate limit exceeded");
        }

        require(block.timestamp >= sale.startTime, "NFTBox: Sale has not started");
        require(block.timestamp <= sale.endTime, "NFTBox: Sale has ended");
        require(sale.currentSupply + amount <= sale.maxSupply, "NFTBox: sold out");
        require(verify(msg.sender, eventId, token, amount, subBoxId, signature), "NFTBox: verify error");
        if (sale.useSubEvent) {
            require(amount + subBoxes[eventId][subBoxId].totalSold <= subBoxes[eventId][subBoxId].maxSupply, "NFTBox: SubBox Rate limit exceeded");
        }

        require(subBoxes[eventId][subBoxId].token == token, "NFTBox: invalid token");
        uint256 totalFund = subBoxes[eventId][subBoxId].price * amount;
        if (externalStakingContract.stakingAddress != address(0)) { // check discount code
            if (uint256(IStakingContract(externalStakingContract.stakingAddress).linearBalanceOf(externalStakingContract.poolId, msg.sender))
                >= externalStakingContract.threshold) {
                totalFund = totalFund - totalFund * externalStakingContract.discountPerMile / 1000;
            }
        }

        if (token == address(0)) {
            require(totalFund == msg.value, "NFTBox: invalid value");
        }
        _fowardFund(totalFund, token);

        if (externalMinted != address(0)) {
            IExternalMinted(externalMinted).mintTokens(msg.sender, amount, subBoxId);
        } else {
            for (uint i = 0; i < amount; i++) {
                uint256 boxId = _createBox(eventId, subBoxId);
                _safeMint(msg.sender, boxId);
            }
        }

        sale.currentSupply += amount;
        subBoxes[eventId][subBoxId].totalSold += amount;
        userBought[eventId][msg.sender] += amount;
    }

    function claimAllNFT() public {
        uint256 length = balanceOf(msg.sender);
        require(length > 0, "NFTBox: User must buy box before claim");

        for (uint256 index = 0; index < length; index++) {
            uint256 currentBalance = balanceOf(msg.sender);
            if (currentBalance == 0) {
                continue;
            }

            uint256 boxId = tokenOfOwnerByIndex(msg.sender, currentBalance - 1);
            if (boxes[boxId].revealed) {
                continue;
            }

            SaleEvent memory sale = saleEvents[boxes[boxId].eventId];
            require(sale.revealed, "NFTBox: User must wait for claim time");
            require(sale.NFT != address(0), "NFTBox: User must wait for claim time");

            uint256 nftId = sale.startNFTId + ((sale.startingIndex + boxId) % sale.maxSupply);

            // transfer NFT
            IERC721(sale.NFT).safeTransferFrom(address(this), msg.sender, nftId);
            // reveal
            boxes[boxId].revealed = true;
            // burn box
            _burn(boxId);

            // emit event claimed
            emit NFTClaimed(msg.sender, boxId, nftId);
        }
    }

    function claimNFT(uint256 boxId) public {
        require(ownerOf(boxId) == msg.sender, "NFTBox: User must be owner of boxId");
        require(!boxes[boxId].revealed, "NFTBox: Box has not been revealed");
        SaleEvent memory sale = saleEvents[boxes[boxId].eventId];
        require(sale.NFT != address(0), "NFTBox: NFT not found");

        uint256 nftId = sale.startNFTId + ((sale.startingIndex + boxId) % sale.maxSupply);

        // transfer NFT
        IERC721(sale.NFT).safeTransferFrom(address(this), msg.sender, nftId);
        // reveal
        boxes[boxId].revealed = true;
        // burn box
        _burn(boxId);

        // emit event claimed
        emit NFTClaimed(msg.sender, boxId, nftId);
    }

    function getBoxDetail(uint256 eventId, uint256 boxId) public view returns (uint256, uint256, uint256, bool) {
        if (boxes.length <= boxId) {
            return (0, 0, 0, false);
        }
        SaleEvent memory sale = saleEvents[boxes[boxId].eventId];
        uint256 nftId = sale.startNFTId + ((sale.startingIndex + boxId) % sale.maxSupply);

        return (boxes[boxId].eventId, boxes[boxId].subBoxId, nftId, boxes[boxId].revealed);
    }

    function _fowardFund(uint256 amount, address token) internal {
        if (token == address(0)) { // native token (BNB)
            (bool isSuccess,) = fundWallet.call{value: msg.value}("");
            require(isSuccess, "Transfer failed: gas error");
            return;
        }

        IERC20(token).transferFrom(msg.sender, fundWallet, amount);
    }

    function _createBox(uint256 eventId, uint256 subBoxId) private returns (uint256) {
        uint256 id = boxes.length;
        boxes.push(Box(id, 0, eventId, subBoxId, false));

        emit BoxCreated(id);
        return id;
    }

    function _linkAllBoxes(uint256 saleId, uint256 seed) internal {
        SaleEvent storage sale = saleEvents[saleId];
        uint256 startingIndex = seed % sale.maxSupply;
        sale.startingIndex = startingIndex;
        sale.revealed = true;

//        for (uint256 index = 0; index < sale.maxSupply; index++) {
//            Box storage box = boxes[index];
//            box.nftId = sale.startNFTId + ((startingIndex + index) % sale.maxSupply);
//            box.revealed =  true;
//        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        if (from != address(0) && to != address(0)) {
            require(allowTransfer, "NFTBox: Box is not allowed to transfer");
        }

        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }

    // Verify signature function
    function verify(
        address _candidate,
        uint256 eventId,
        address token,
        uint256 amount,
        uint256 subBoxId,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(_candidate, eventId, token, amount, subBoxId));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return getSignerAddress(ethSignedMessageHash, signature) == signer;
    }

    function getSignerAddress(bytes32 _messageHash, bytes memory _signature) public pure returns (address) {
        return ECDSA.recover(_messageHash, _signature);
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return ECDSA.toEthSignedMessageHash(_messageHash);
    }

    receive() external payable {}
    fallback() external payable {}
}