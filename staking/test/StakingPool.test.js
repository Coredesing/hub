const chai = require('chai');
const { ethers } = require("hardhat");
const { utils, BigNumber } = ethers;
const { expect } = chai;
const { duration, advanceBlockTo } = require("./utilities/time.js");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
} = require('@openzeppelin/test-helpers');


describe("Staking Pool", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.minter = this.signers[4];

    this.StakingPool = await ethers.getContractFactory("StakingPool");
  });
  beforeEach(async function () {
    this.AcceptedToken = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.pkf = await this.AcceptedToken.deploy("PolkaFoundry", "PKF", utils.parseEther("1000000000"));
    await this.pkf.deployed();
  });

  // Mega test to check intergration with multiple pools
  context("With alocation pool, flexible pool and fixed pool", function () {
    beforeEach(async function () {
      await this.pkf.transfer(this.alice.address, utils.parseEther("10000"));
      await this.pkf.transfer(this.bob.address, utils.parseEther("10000"));
      await this.pkf.transfer(this.carol.address, utils.parseEther("10000"));

      this.lp = await this.ERC20Mock.deploy("LPToken", "LP", utils.parseEther("1000000000"));

      await this.lp.transfer(this.alice.address, utils.parseEther("1000"));

      await this.lp.transfer(this.bob.address, utils.parseEther("1000"));

      await this.lp.transfer(this.carol.address, utils.parseEther("1000"));
    });
    it("should distribute pkfs properly for each staker", async function () {

      this.pool = await upgrades.deployProxy(this.StakingPool, [this.pkf.address, utils.parseEther("2"), "0"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.allocSetRewardDistributor(this.minter.address);
      /*
        Start creating pools
      */
      // flexible pool with 5% APR, 7 days delay when making withdrawal
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      // fixed pool with 200% APR, lock in 1 year, no delay when making withdrawal
      await this.pool.linearAddPool(
        0,
        0,
        0,
        200,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(365).toNumber()
      );

      // allocation pool with 50% rewards each
      await this.pool.allocAddPool("100", this.pkf.address, "0");
      await this.pool.allocAddPool("100", this.lp.address, "0");
      /*
        End creating pools
      */


      await this.lp.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.lp.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });
      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("10000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("10000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 PKFs to allocation pool at block 1300
      await advanceBlockTo("1299");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      expect((await this.pool.allocUserInfo(0, this.alice.address)).amount).to.equal(utils.parseEther("100"));


      // Bob deposits 100 LPs to allocation pool at block 1310
      await advanceBlockTo("1309");
      await this.pool
        .connect(this.bob)
        .allocDeposit(1, utils.parseEther("100"), { from: this.bob.address });
      expect((await this.pool.allocUserInfo(1, this.bob.address)).amount).to.equal(utils.parseEther("100"));

      // Bob deposits 100 PKFs to allocation pool at block 1350
      await advanceBlockTo("1349");
      await this.pool
        .connect(this.bob)
        .allocDeposit(0, utils.parseEther("100"), { from: this.bob.address });
      expect((await this.pool.allocUserInfo(0, this.bob.address)).amount).to.equal(utils.parseEther("100"));


      // Alice deposits 100 tokens to fixed pool
      await this.pool
        .connect(this.alice)
        .linearDeposit(1, utils.parseEther("100"), { from: this.alice.address });

      // Alice deposits 100 tokens to flexible pool
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9700"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens to flexible pool
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("9700"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));

      // After 1 years
      await time.increase(duration.years(1).toNumber());
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9700"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(Number("20").toFixed(2));
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("9700"));
      expect(await this.pool.linearBalanceOf(0, this.bob.address)).to.equal(utils.parseEther("200"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.bob.address))).toFixed(2)).to.equal(Number("40").toFixed(2));

      // Alice withdraws 100 tokens from flexible pool
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });

      // Bob withdraws 100 tokens.
      await this.pool
        .connect(this.bob)
        .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address });

      // Alice and Bob need to wait 7 days to claim pending withdrawal
      await time.increase(duration.days(7).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });
      await this.pool
        .connect(this.bob)
        .linearClaimPendingWithdraw(0, { from: this.bob.address });

      // Alice should have: 10000 - 200 + 20% * 100 = 9820
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number("9820").toFixed(2));

      // Bob should have: 10000 - 100 + 20% * 200 = 9940
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.bob.address))).toFixed(2)).to.equal(Number("9940").toFixed(2));


      // Alice withdraws 100 PKFs from allocation pool at block 1450
      await advanceBlockTo("1449");
      await this.pool
        .connect(this.alice)
        .allocWithdraw(0, utils.parseEther("100"), true, { from: this.alice.address });
      // Alice should have 9820 + 100 + 50 * 1 + 100 * 0.5 = 10020
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number("10020").toFixed(2));

      // Bob withdraws 100 PKFs from allocation pool at block 1500
      await advanceBlockTo("1499");
      await this.pool
        .connect(this.bob)
        .allocWithdraw(0, utils.parseEther("100"), true, { from: this.bob.address });
      // Bob should have 9940 + 100 + 100 * 0.5 + 50 * 1 = 10120
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.bob.address))).toFixed(2)).to.equal(Number("10140").toFixed(2));

      // Bob withdraws 100 LPs from allocation pool at block 1510
      await advanceBlockTo("1509");
      await this.pool
        .connect(this.bob)
        .allocWithdraw(1, utils.parseEther("100"), true, { from: this.bob.address });
      // Bob should have 10140 + 200 * 1 = 10340
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.bob.address))).toFixed(2)).to.equal(Number("10340").toFixed(2));

      // Alice withdraws 100 tokens from fixed pool
      await this.pool
        .connect(this.alice)
        .linearWithdraw(1, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have 10020 + 100 + 200 = 10320
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number("10320").toFixed(2));
    });
    it("should allow user to switch from allocation to linear pool", async function () {

      this.pool = await upgrades.deployProxy(this.StakingPool, [this.pkf.address, utils.parseEther("2"), "0"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.allocSetRewardDistributor(this.minter.address);
      /*
        Start creating pools
      */
      // flexible pool with 5% APR, 7 days delay when making withdrawal
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      // fixed pool with 200% APR, lock in 1 year, no delay when making withdrawal
      await this.pool.linearAddPool(
        0,
        0,
        0,
        365,
        duration.days(200).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      // allocation pool with 50% rewards each
      await this.pool.allocAddPool("100", this.pkf.address, "0");
      await this.pool.allocAddPool("100", this.lp.address, "0");
      /*
        End creating pools
      */

      await this.lp.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("10000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 PKFs to allocation pool at block 2300
      await advanceBlockTo("2299");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      expect((await this.pool.allocUserInfo(0, this.alice.address)).amount).to.equal(utils.parseEther("100"));

      // Alice deposits 100 tokens to fixed pool
      await this.pool
        .connect(this.alice)
        .linearDeposit(1, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9800"));
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9800"));

      expect(await this.pool.linearTotalStaked(1)).to.equal(utils.parseEther("100"));

      // After 100 days, Alice switch from allocation to linear pool
      await advanceBlockTo("2398");
      await time.increase(duration.days(100).toNumber());
      await this.pool
        .connect(this.alice)
        .fromAllocToLinear(0, 1, utils.parseEther("100"), true, { from: this.alice.address });

      // Alice should have: 10000 - 200 + 1 * 100 = 9900
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9900"));
      expect(await this.pool.linearBalanceOf(1, this.alice.address)).to.equal(utils.parseEther("200"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(1, this.alice.address))).toFixed(2)).to.equal(Number("100").toFixed(2));

      // Alice should not be able to withdraw after 100 more days (total 200 days)
      await time.increase(duration.days(100).toNumber());
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearWithdraw(1, utils.parseEther("200"), { from: this.alice.address }),
        "LinearStakingPool: still locked"
      );

      // Alice should be able to withdraw after 100 more days (total 300 days)
      await time.increase(duration.days(100).toNumber());
      await this.pool
        .connect(this.alice)
        .linearWithdraw(1, utils.parseEther("200"), { from: this.alice.address });

      // Alice should have: 9900 + 200 + 100 * 100% + 200 * 200% = 10600
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number("10600").toFixed(2));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(1, this.alice.address))).toFixed(2)).to.equal(Number("0").toFixed(2));

    });
    it("should upgradeable", async function () {
      const StakingPool = await ethers.getContractFactory("StakingPool");
      // This should be a new implementation
      const StakingPoolV2 = await ethers.getContractFactory("StakingPool");

      const instance = await upgrades.deployProxy(StakingPool, [this.pkf.address, utils.parseEther("1"), "0"], {
        initializer: '__StakingPool_init'
      });
      await instance.deployed();

      const upgraded = await upgrades.upgradeProxy(instance.address, StakingPoolV2);

      expect((await upgraded.linearAcceptedToken())).to.equal(this.pkf.address);
      expect((await upgraded.allocRewardToken())).to.equal(this.pkf.address);
    });

  });
});
