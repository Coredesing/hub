//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameFI is ERC721, Ownable {
    string public uri;
    uint256 public maxSupply;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public tokenSold;
    mapping(address => bool) public minters;

    struct GF {
        uint256 unique;
    }

    GF[] private _nfts;

    event NFTCreated(uint256 indexed id);

    constructor(
        string memory name,
        string memory symbol,
        string memory _uri,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxSupply
    ) ERC721(name, symbol) {
        uri = _uri;
        maxSupply = _maxSupply;
        startTime = _startTime;
        endTime = _endTime;

        minters[msg.sender] = true;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        uri = baseURI;
    }

    function grantMinterRole(address minter) public onlyOwner {
        minters[minter] = true;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "Minter: invalid permission");
        _;
    }

    function mint(uint256 amount, address receiver) onlyMinter external {
        require(block.timestamp >= startTime, "NFT: Sale has not started");
        require(block.timestamp <= endTime, "NFT: Sale has ended");
        require(tokenSold + amount <= maxSupply, "Mint: sold out");
        for (uint i = 0; i < amount; i++) {
            uint nftId = _createNFT();
            _safeMint(receiver, nftId);
            tokenSold++;
        }
    }

    function _createNFT() private returns (uint256) {
        // Do not using this in mainnet. This is not safe for random based on block
        uint unique = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        _nfts.push(GF(unique));
        uint256 id = _nfts.length - 1;

        emit NFTCreated(id);
        return id;
    }

    function totalSupply() external view returns (uint) {
        return _nfts.length;
    }

    function getMaxSupply() external view returns (uint) {
        return maxSupply;
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }
}