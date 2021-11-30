//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GameFIMock is ERC721Enumerable, AccessControl, ERC721Holder {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    uint256 public maxSupply;
    uint256 public tokenSold;
    string public baseURI;

    struct GF {
        uint256 unique;
    }

    GF[] private _nfts;

    event NFTCreated(uint256 indexed id);

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        baseURI = "https://data.mechmaster.io/api/mecha/";
    }

    function grantMinterRole(address account) onlyRole(DEFAULT_ADMIN_ROLE) external {
        grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) onlyRole(DEFAULT_ADMIN_ROLE) external {
        revokeRole(MINTER_ROLE, account);
    }

    function mint(uint256 amount, address receiver) onlyRole(MINTER_ROLE) external {
        for (uint i = 0; i < amount; i++) {
            uint nftId = _createNFT();
            _safeMint(receiver, nftId);
            tokenSold++;
        }
    }

    function _createNFT() private returns (uint256) {
        uint unique = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        _nfts.push(GF(unique));
        uint256 id = _nfts.length - 1;

        emit NFTCreated(id);
        return id;
    }

    function setBaseURI(string memory uri) onlyRole(DEFAULT_ADMIN_ROLE) external {
        baseURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}