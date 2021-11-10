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

contract GameFiBoxASPO is Initializable, OwnableUpgradeable, ERC721EnumerableUpgradeable, ERC721HolderUpgradeable {
    struct SaleEvent {
        uint256 currentSupply;
        uint256 maxSupply;
        uint256 startTime;
        uint256 endTime;
        uint256 maxPerBatch;
        address NFT;
        uint256 startNFTId;
        uint256 revealed;
        uint256 startingBoxIndex;
        bool useExternalRandom;
        bool useSubEvent;
        bool useExternalMint;
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
    }

    struct RandomEvent {
        uint256 eventId;
        bool isRequest;
        bool isFulFill;
    }

    struct Rate {
        uint256 rate;
        uint256 decimal;
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
    mapping(address => Rate) prices;
    SaleEvent[] public saleEvents;
    Box[] public boxes;

    event BoxCreated(uint256 indexed id);
    event NewSaleEventAdded(uint256 indexed id);
    event SaleEventTimeUpdated(uint256 id, uint256 startTime, uint256 endTime);
    event SaleEventPriceUpdated(uint256 id, uint256 price);
    event SaleEventRangeIdUpdated(uint256 id, uint256 startNFTId, uint256 maxSupply);
    event SaleEventNFTUpdated(uint256 id, address nft);
    event SaleEventExternalRandomUpdated(uint256 id, bool useExternalRandom);
    event RandomBox(uint256 boxId, uint256 nftId);
    event RandomSpecialBox(uint256 seed, uint256 boxId, uint256 nftId);
    event SetRandomNumber(address sender, uint256 eventId, bytes32 requestId, uint256 randomness);

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
        require(_externalRandom != address(0), "invalid contract");
        externalRandom = _externalRandom;
    }

    function setExternalMinted(address _externalMinted) public onlyOwner {
        require(_externalMinted != address(0), "invalid contract");
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

    function setSubBox(uint256 eventID, uint256[] memory max) public onlyOwner {
        for (uint256 index = 0; index < max.length; index++) {
            subBoxes[eventID][index] = SubBox(index, max[index], 0);
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

    function setPrices(
        address[] memory _tokens,
        uint256[] memory _rates,
        uint256[] memory _decimals
    ) external onlyOwner {
        require(_tokens.length == _rates.length, "invalid length");
        require(_tokens.length == _decimals.length, "invalid length");

        for (uint256 index = 0; index < _tokens.length; index++) {
            prices[_tokens[index]] = Rate(_rates[index], _decimals[index]);
        }
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

    function setSaleEventExternalRandom(
        uint256 id,
        bool useExternalRandom
    ) external onlyOwner {
        SaleEvent storage saleEvent = saleEvents[id];
        saleEvent.useExternalRandom = useExternalRandom;
        emit SaleEventExternalRandomUpdated(id, useExternalRandom);
    }

    function setSaleEventExternalMint(
        uint256 id,
        bool useExternalMint
    ) external onlyOwner {
        SaleEvent storage saleEvent = saleEvents[id];
        saleEvent.useExternalMint = useExternalMint;
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
        uint256 startingBoxIndex,
        bool useExternalRandom,
        bool useSubEvent,
        bool useExternalMint
    ) external onlyOwner {
        require(_maxSupply > 0, "invalid number");

        if (saleEvents.length > 0) {
            SaleEvent memory latestSale = saleEvents[saleEvents.length - 1];
            require(latestSale.currentSupply == latestSale.maxSupply || block.timestamp > latestSale.endTime, "The current sale events has not sold out");
        }

        saleEvents.push(SaleEvent(0, _maxSupply, startTime, endTime, maxPerBatch, nft, startNFTId, 0, startingBoxIndex, useExternalRandom, useSubEvent, useExternalMint));
        emit NewSaleEventAdded(saleEvents.length);
    }

    function setRandomNumber(uint256 eventId, bytes32 requestId, uint256 randomness) external {
        require(msg.sender == externalRandom, "NFTBox: msg.sender is not valid");

        SaleEvent memory sale = saleEvents[eventId];
        require(sale.startTime > 0, "event not found");
        require(sale.currentSupply == sale.maxSupply || block.timestamp > sale.endTime, "The current sale events has not sold out");
        require(sale.revealed < sale.maxSupply, "The current sale has random successfully");

        uint256 seed = randomness % sale.maxSupply;
        for (uint256 index = 0; index < sale.maxSupply; index++) {
            uint256 length = 1;
            if (sale.maxSupply > sale.revealed) {
                length = sale.maxSupply - sale.revealed;
            }
            seed = uint256(keccak256(abi.encodePacked(seed, index))) % length;
            _linkBox(eventId, index + sale.startingBoxIndex, seed);
        }

        emit SetRandomNumber(msg.sender, eventId, requestId, randomness);
    }

    function randomEvent(uint256 eventId) public onlyOwner {
        SaleEvent storage sale = saleEvents[eventId];
        require(sale.startTime > 0, "event not found");
        require(sale.currentSupply == sale.maxSupply || block.timestamp > sale.endTime, "The current sale events has not sold out");
        require(sale.revealed < sale.maxSupply, "The current sale has random successfully");

        uint256 seed = 0;
        if (sale.useExternalRandom && externalRandom != address(0)) {
            (uint256 randomness, bool isOk) = IExternalRandom(externalRandom).requestRandomNumber(eventId);
            if (!isOk) {
                return;
            }
            seed = randomness % sale.maxSupply;
        } else {
            seed = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, eventId))) % sale.maxSupply;
        }

        for (uint256 index = 0; index < sale.maxSupply; index++) {
            uint256 length = 1;
            if (sale.maxSupply > sale.revealed) {
                length = sale.maxSupply - sale.revealed;
            }
            seed = uint256(keccak256(abi.encodePacked(seed, index))) % length;
            _linkBox(eventId, index + sale.startingBoxIndex, seed);
        }
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

        require(prices[token].rate > 0, "NFTBox: invalid rate");

        uint256 totalFund = amount * prices[token].rate / (10 ** prices[token].decimal);
        if (token == address(0)) {
            require(msg.value == totalFund, "NFTBox: invalid value");
        }
        _fowardFund(totalFund, token);

        if (sale.useExternalMint && externalMinted != address(0)) {
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
            if (!boxes[boxId].revealed) {
                continue;
            }

            SaleEvent memory sale = saleEvents[boxes[boxId].eventId];
            if(sale.NFT == address(0)) {
                continue;
            }

            // transfer NFT
            IERC721(sale.NFT).safeTransferFrom(address(this), msg.sender, boxes[boxId].nftId);
            // reveal
            boxes[boxId].revealed = true;
            // burn box
            _burn(boxId);
        }
    }

    function claimNFT(uint256 boxId) public {
        require(ownerOf(boxId) == msg.sender, "NFTBox: User must be owner of boxId");
        require(boxes[boxId].revealed, "NFTBox: Box has not been revealed");
        SaleEvent memory sale = saleEvents[boxes[boxId].eventId];
        require(sale.NFT != address(0), "NFTBox: NFT not found");

        // transfer NFT
        IERC721(sale.NFT).safeTransferFrom(address(this), msg.sender, boxes[boxId].nftId);
        // reveal
        boxes[boxId].revealed = true;
        // burn box
        _burn(boxId);
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

    function _linkBox(uint256 saleId, uint256 boxId, uint256 seed) internal {
        SaleEvent storage sale = saleEvents[saleId];
        if (boxes.length <= boxId || boxes[boxId].revealed || sale.maxSupply < 1) {
            return;
        }
        Box storage box = boxes[boxId];

        for (uint256 index = sale.startNFTId; index <= sale.startNFTId + sale.maxSupply - 1; index++) {
            if (seed == 0 && !minted[index]) {
                // update sale
                minted[index] = true;
                sale.revealed++;

                // update box
                box.nftId = index;
                box.revealed =  true;
                emit RandomBox(boxId, index);
                return;
            }

            if (seed == 0 && minted[index]) {
                continue;
            }

            if (seed > 0) {
                seed = seed - 1;
            }
        }

        // why it is here?
        for (uint256 index = sale.startNFTId; index <= sale.startNFTId + sale.maxSupply - 1; index++) {
            if (!minted[index]) {
                // update sale
                minted[index] = true;
                sale.revealed++;

                // update box
                box.nftId = index;
                box.revealed =  true;
                emit RandomSpecialBox(seed, boxId, index);
                return;
            }
        }
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