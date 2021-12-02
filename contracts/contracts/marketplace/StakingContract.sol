// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

interface GameFiStaking {
    function linearBalanceOf(uint256 _poolId, address _account) external view returns (uint128);
}

/**
 * Staking
 */
contract StakingContract is Ownable {
    // The address of GameFi
    address public gamefi;

    constructor() {
    }

    function setGameFi(address _gamefi) public onlyOwner {
        gamefi = _gamefi;
    }

    function points(address _account) public view returns (uint256) {
        return uint256(GameFiStaking(gamefi).linearBalanceOf(0, _account));
    }
}
