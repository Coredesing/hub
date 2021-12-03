// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IStakingContract {
    struct Ranking {
        uint256 threshold;
        uint256 permile; // per a thousand
    }

    // calculate staking points from proxy contract (Linear pool, LP pool and bonus)
    function points(address _account) external view returns (uint256);

    function linearBalanceOf(uint256 _poolId, address _account) external view returns (uint128);
}