//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LegendNFT is ERC721, AccessControl {
    bytes32 public constant OPERATOR = keccak256("OPERATOR");

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    string public uri;
    bool private allowTransfer;

    struct Legend {
        bool isValid;
        uint256 level;
    }
    Legend[] private legends;

    constructor(
        string memory name,
        string memory symbol,
        string memory _uri
    ) ERC721(name, symbol) {
        uri = _uri;
        allowTransfer = false;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setBaseURI(string memory baseURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        uri = baseURI;
    }

    function setStatus(uint256 id, bool valid) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(id < legends.length, "Invalid id");

        legends[id].isValid = valid;
    }

    function setAllowTransfer(bool allow) public onlyRole(DEFAULT_ADMIN_ROLE) {
        allowTransfer = allow;
    }

    function setLevel(uint256 id, uint256 level) external onlyRole(OPERATOR) {
        require(id < legends.length, "Invalid id");

        legends[id].level = level;
    }

    function grantAdminRole(address account) onlyRole(DEFAULT_ADMIN_ROLE) external {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function revokeAdminRole(address account) onlyRole(DEFAULT_ADMIN_ROLE) external {
        revokeRole(DEFAULT_ADMIN_ROLE, account);
    }

    function grantOperatorRole(address account) onlyRole(DEFAULT_ADMIN_ROLE) external {
        grantRole(OPERATOR, account);
    }

    function revokeOperatorRole(address account) onlyRole(DEFAULT_ADMIN_ROLE) external {
        revokeRole(OPERATOR, account);
    }

    function mint(address receiver) onlyRole(DEFAULT_ADMIN_ROLE) external {
        uint256 id = _createLegend();
        _safeMint(receiver, id);
    }

    function _createLegend() private returns (uint256) {
        legends.push(Legend(true, 0));
        uint256 id = legends.length - 1;
        return id;
    }

    function totalSupply() external view returns (uint) {
        return legends.length;
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        if (from != address(0) && to != address(0)) {
            require(allowTransfer, "ERC721: Legend is not allowed to transfer");
            require(legends[tokenId].isValid, "ERC721: Expired Legend is not allowed to transfer");
        }

        super._beforeTokenTransfer(from, to, tokenId);
    }
}