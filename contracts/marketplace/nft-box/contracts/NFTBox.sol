//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./VRFConsumerBaseUpgradable.sol";

contract NFTBox is Initializable, OwnableUpgradeable, ERC721EnumerableUpgradeable, ERC721HolderUpgradeable, VRFConsumerBaseUpgradable {
    struct SaleEvent {
        uint256 currentSupply;
        uint256 maxSupply;
        uint256 price;
        uint256 startTime;
        uint256 endTime;
        uint256 maxPerBatch;
        address NFT;
        uint256 startNFTId;
        uint256 revealed;
        uint256 startingBoxIndex;
        bool useExternalRandom;
        bool useSubEvent;
    }

    struct Box {
        uint256 id;
        uint256 nftId;
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

    string public uri;
    uint256 public maxSupply;
    address public fundWallet;
    address public signer;
    bytes32 internal keyHash;
    uint256 public constant FEE_RANDOM = 10 ** 17; // 0.1 LINK
    mapping(uint256 => mapping(uint256 => bool)) public minted; // check nftId is minted for saleId
    mapping(uint256 => mapping(uint256 => SubBox)) public subBoxes;
    mapping(bytes32 => RandomEvent) public randomMapping; // match random requestId vs eventId
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

    function __NFTBox_init(
        string memory name,
        string memory symbol,
        string memory _uri,
        address _signer,
        address _fundWallet,
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash
    ) public initializer {
        __Ownable_init();
        ERC721Upgradeable.__ERC721_init(name, symbol);
        VRFConsumerBaseUpgradable.initialize(_vrfCoordinator, _linkToken);

        uri = _uri;
        signer = _signer;
        fundWallet = _fundWallet;
        keyHash = _keyHash;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        uri = baseURI;
    }

    function setVrfCoordinator(address _vrfCoordinator, address _linkToken) public onlyOwner {
        require(_vrfCoordinator != address(0), "invalid contract");
        VRFConsumerBaseUpgradable.initialize(_vrfCoordinator, _linkToken);
    }

    function setKeyHash(bytes32 _keyHash) public onlyOwner {
        keyHash = _keyHash;
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

    function setSaleEventPrice(
        uint256 id,
        uint256 price
    ) external onlyOwner {
        SaleEvent storage saleEvent = saleEvents[id];
        saleEvent.price = price;
        emit SaleEventPriceUpdated(id, price);
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

    function addSaleEvent(
        uint256 _maxSupply,
        uint256 salePrice,
        uint256 startTime,
        uint256 endTime,
        uint256 maxPerBatch,
        address nft,
        uint256 startNFTId,
        uint256 startingBoxIndex,
        bool useExternalRandom,
        bool useSubEvent
    ) external onlyOwner {
        require(_maxSupply > 0, "invalid number");

        if (saleEvents.length > 0) {
            SaleEvent memory latestSale = saleEvents[saleEvents.length - 1];
            require(latestSale.currentSupply == latestSale.maxSupply || block.timestamp > latestSale.endTime, "The current sale events has not sold out");
        }

        saleEvents.push(SaleEvent(0, _maxSupply, salePrice, startTime, endTime, maxPerBatch, nft, startNFTId, 0, startingBoxIndex, useExternalRandom, useSubEvent));
        emit NewSaleEventAdded(saleEvents.length);
    }

    function getRandomNumber(uint256 eventId) public onlyOwner {
        require(LINK.balanceOf(address(this)) >= FEE_RANDOM, "Not enough LINK - fill contract with faucet");
        bytes32 requestId = requestRandomness(keyHash, FEE_RANDOM);
        require(!randomMapping[requestId].isRequest, "NFTBox: random error");
        randomMapping[requestId] = RandomEvent(eventId, true, false);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(randomMapping[requestId].isRequest && !randomMapping[requestId].isFulFill, "NFTBox: fulfill error");
        uint256 eventId = randomMapping[requestId].eventId;
        SaleEvent storage sale = saleEvents[eventId];
        require(sale.startTime > 0, "event not found");
        require(sale.currentSupply == sale.maxSupply || block.timestamp > sale.endTime, "The current sale events has not sold out");
        require(sale.revealed < sale.maxSupply, "The current sale has random successfully");

        uint256 seed = randomness;
        for (uint256 index = 0; index < sale.maxSupply; index++) {
            seed = uint256(keccak256(abi.encodePacked(seed, block.timestamp, eventId, index))) % (sale.maxSupply - sale.revealed);
            _linkBox(eventId, index + sale.startingBoxIndex, seed);
        }
    }

    function randomEvent(uint256 eventId) public onlyOwner {
        SaleEvent storage sale = saleEvents[eventId];
        require(sale.startTime > 0, "event not found");
        require(sale.currentSupply == sale.maxSupply || block.timestamp > sale.endTime, "The current sale events has not sold out");
        require(sale.revealed < sale.maxSupply, "The current sale has random successfully");

        uint256 seed = 0;
        if (sale.useExternalRandom) {
            getRandomNumber(eventId);
            return;
        } else {
            seed = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, eventId))) % sale.maxSupply;
        }

        for (uint256 index = 0; index < sale.maxSupply; index++) {
            seed = uint256(keccak256(abi.encodePacked(seed, block.timestamp, eventId, index))) % (sale.maxSupply - sale.revealed);
            _linkBox(eventId, index + sale.startingBoxIndex, seed);
        }
    }

    function claimBox(uint256 eventId, uint256 amount, uint256 subBoxId, bytes memory signature) public payable {
        SaleEvent storage sale = saleEvents[eventId];
        require(amount > 0 && amount + balanceOf(msg.sender) <= sale.maxPerBatch, "NFTBox: Rate limit exceeded");
        require(block.timestamp >= sale.startTime, "NFTBox: Sale has not started");
        require(block.timestamp <= sale.endTime, "NFTBox: Sale has ended");
        require(sale.currentSupply + amount <= sale.maxSupply, "NFTBox: sold out");
        require(msg.value == sale.price * amount, "NFTBox: invalid value");
        require(verify(msg.sender, eventId, amount, subBoxId, signature), "NFTBox: verify error");

        if (sale.useSubEvent) {
            require(amount + subBoxes[eventId][subBoxId].totalSold <= subBoxes[eventId][subBoxId].maxSupply, "NFTBox: SubBox Rate limit exceeded");
        }

        (bool isSuccess,) = fundWallet.call{value: msg.value}("");
        require(isSuccess);

        for (uint i = 0; i < amount; i++) {
            uint256 boxId = _createBox();
            _safeMint(msg.sender, boxId);
        }

        sale.currentSupply += amount;
        subBoxes[eventId][subBoxId].totalSold += amount;
    }

    function claimNFT(uint256 eventId) public {
        SaleEvent storage sale = saleEvents[eventId];
        require(block.timestamp > sale.endTime || sale.maxSupply == sale.revealed, "NFTBox: Sale has not ended");
        require(sale.NFT != address(0), "NFTBox: Cannot claim NFT");
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

            // transfer NFT
            IERC721(sale.NFT).safeTransferFrom(address(this), msg.sender, boxes[boxId].nftId);

            boxes[boxId].revealed = true;
            // burn box
            _burn(boxId);
        }
    }

    function _createBox() private returns (uint256) {
        uint256 id = boxes.length;
        boxes.push(Box(id, 0, false));

        emit BoxCreated(id);
        return id;
    }

    function _linkBox(uint256 saleId, uint256 boxId, uint256 seed) private {
        SaleEvent storage sale = saleEvents[saleId];
        // require(!boxes[boxId].revealed, "The current box has been revealed");
        if (boxes[boxId].revealed) {
            return;
        }

        for (uint256 index = sale.startNFTId; index <= sale.startNFTId + sale.maxSupply - 1; index++) {
            if (seed == 0 && !minted[saleId][index]) {
                // update sale
                minted[saleId][index] = true;
                sale.revealed = sale.revealed + 1;

                // update box
                boxes[boxId].nftId = index;
                boxes[boxId].revealed =  true;
                emit RandomBox(boxId, index);
                return;
            }

            if (seed == 0 && minted[saleId][index]) {
                continue;
            }

            seed = seed - 1;
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }

    // Verify signature function
    function verify(
        address _candidate,
        uint256 eventId,
        uint256 amount,
        uint256 subBoxId,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(_candidate, eventId, amount, subBoxId));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return getSignerAddress(ethSignedMessageHash, signature) == signer;
    }

    function getSignerAddress(bytes32 _messageHash, bytes memory _signature) public pure returns(address) {
        return ECDSA.recover(_messageHash, _signature);
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return ECDSA.toEthSignedMessageHash(_messageHash);
    }
}