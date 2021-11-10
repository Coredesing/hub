
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFRequestIDBase.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface INFTBox {
    function setRandomNumber(uint256 eventId, bytes32 requestId, uint256 randomness) external;
}

contract ExternalRandom is VRFConsumerBase, AccessControl {
    event SetRandomNumber(uint256 eventId, bytes32 indexed requestId, uint256 randomness);
    event MappingRequest(uint256 eventId, bytes32 indexed requestId);
    event ErrorMessage(uint256 eventId, string msg);
    event ErrorBytesMessage(uint256 eventId, bytes msg);

    // https://docs.chain.link/docs/vrf-contracts/
    // Mainnet BSC
    bytes32 public KeyHash = 0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c;
    uint256 public feeRandom = 10 ** 17; // 0.1 LINK

    struct RandomEvent {
        uint256 eventId;
        uint256 randomness;
        bool isRequest;
        bool isFulFill;
    }

    mapping(bytes32 => RandomEvent) public randomMapping; // match random requestId vs eventId
    mapping(uint256 => RandomEvent) public randomResult; // match random eventId vs random result
    address public NFTBox;

    constructor(address nftBox, address VRFCoordinator, address LinkToken) VRFConsumerBase(VRFCoordinator, LinkToken) {
        NFTBox = nftBox;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        if (nftBox != address(0)) {
            _setupRole(DEFAULT_ADMIN_ROLE, nftBox);
        }
    }

    function setNftBox(address nftBox) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(nftBox != address(0) && nftBox != msg.sender, "invalid address");
        revokeRole(DEFAULT_ADMIN_ROLE, NFTBox);
        NFTBox = nftBox;
        _setupRole(DEFAULT_ADMIN_ROLE, nftBox);
    }

    function setKeyHash(bytes32 keyHash) external onlyRole(DEFAULT_ADMIN_ROLE) {
        KeyHash = keyHash;
    }

    function requestRandomNumber(uint256 eventId) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256, bool) {
        if (randomResult[eventId].isFulFill) {
            return (randomResult[eventId].randomness, true);
        }

        require(LINK.balanceOf(address(this)) >= feeRandom, "Not enough LINK - fill contract with faucet");
        bytes32 requestId = requestRandomness(KeyHash, feeRandom);
        randomMapping[requestId] = RandomEvent(eventId, 0, true, false);
        emit MappingRequest(eventId, requestId);

        return (0, false);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 eventId = randomMapping[requestId].eventId;
        randomResult[eventId] = RandomEvent(eventId, randomness, true, true);

        try INFTBox(NFTBox).setRandomNumber(eventId, requestId, randomness) {} catch Error(string memory msg){
    emit ErrorMessage(eventId, msg);
    return;
    } catch (bytes memory bytesMsg) {
    emit ErrorBytesMessage(eventId, bytesMsg);
    }

        emit SetRandomNumber(eventId, requestId, randomness);
    }
}