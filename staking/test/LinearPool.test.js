const chai = require('chai');
const { ethers } = require("hardhat");
const { utils, BigNumber } = ethers;
const { expect } = chai;
const { duration } = require("./utilities/time.js");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
} = require('@openzeppelin/test-helpers');


describe("Linear Pool ", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.minter = this.signers[4];

    this.LinearPool = await ethers.getContractFactory("LinearPool");
  });
  beforeEach(async function () {
    this.AcceptedToken = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.pkf = await this.AcceptedToken.deploy("PolkaFoundry", "PKF", utils.parseEther("1000000000"));
    await this.pkf.deployed();
  });

  context("With flexible pool", function () {
    beforeEach(async function () {
      await this.pkf.transfer(this.alice.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.bob.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.carol.address, utils.parseEther("1000"));
    });

    it("should allow emergency withdraw", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));

      await expectRevert(
        this.pool.connect(this.alice).linearEmergencyWithdraw(0),
        "LinearStakingPool: emergency withdrawal is not allowed yet"
      );

      await this.pool.linearSetAllowEmergencyWithdraw(true);

      await this.pool.connect(this.alice).linearEmergencyWithdraw(0);

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1000"));
    });
    it("should not allow admin set delay duration too long", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();

      await expectRevert(
        this.pool.linearAddPool(
          0,
          0,
          0,
          5,
          0,
          duration.days(36).toNumber(),
          (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.years(1).toNumber()
        ),
        "LinearStakingPool: delay duration is too long"
      );

      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(15).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
    });
    it("should distribute pkfs properly for each staker", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens at time Delta
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      await time.increaseTo(duration.days(365).add(delta.toString()).toNumber());
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(Number("5").toFixed(2));

      // Alice withdraws 100 tokens at time Delta + 2 year.
      await time.increaseTo(duration.days(365 * 2).add(delta.toString()).toNumber());
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      await time.increase(duration.days(7).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });
      // Alice should have: 1000 + 2 * 5% * 100 = 1010
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number("1010").toFixed(2));

    });
    it("should not allow user to withdraw before waiting delay time", async function () {
      // default flexible pool with 5% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        5,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address })

      // Alice should not be able to claim withdraw after 4 days.
      await time.increase(duration.days(4).toNumber());
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearClaimPendingWithdraw(0, { from: this.alice.address }),
        "LinearStakingPool: not released yet"
      );

      // Alice should be able to withdraw after 3 more days.
      await time.increase(duration.days(3).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });
    });
    it("should allow user to deposit multiple times", async function () {
      // flexible pool with 100% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        100,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(10).toNumber()
      );

      await this.pkf.connect(this.minter).transfer(this.alice.address, utils.parseEther("9000"));
      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("10000"), {
        from: this.alice.address,
      });

      // Alice deposits 1000 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("1000"), { from: this.alice.address });
      let delta = await time.latest();
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("9000"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("1000"));

      // After 1 day, Alice deposits 2000 tokens
      await time.increaseTo(duration.days(1).add(delta.toString()).toNumber());
      expect(await this.pool.linearPendingReward(0, this.alice.address)).to.equal(BigNumber.from(utils.parseEther("1000")).div("365"));
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("2000"), { from: this.alice.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("7000"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("3000"));

      // After 1 day, Alice claims pending rewards
      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("1000")).div("365").add(BigNumber.from(utils.parseEther("3000")).div("365")))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("3000")).div("365"))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("1000"), { from: this.alice.address });

      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("2000")).div("365"))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("2000"), { from: this.alice.address });
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      await time.increase(duration.days(1).toNumber());
      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(
        Number(utils.formatEther(BigNumber.from(utils.parseEther("4000")).div("365"))).toFixed(2)
      );
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("4000"), { from: this.alice.address });

      await time.increase(duration.days(7).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(0, { from: this.alice.address });

      // Rounding to 2-digit number, because dealing with time in block chain is fkin hard
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number(utils.formatEther(BigNumber.from(
        utils.parseEther("10000")
          .add(utils.parseEther("1000").div("365"))
          .add(utils.parseEther("3000").div("365"))
          .add(utils.parseEther("3000").div("365"))
          .add(utils.parseEther("2000").div("365"))
          .add(utils.parseEther("4000").div("365"))
      ))).toFixed(2));

    });
    it("should allow user to switch to another pool", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        0,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      await this.pool.linearAddPool(
        0,
        0,
        0,
        0,
        0,
        duration.days(14).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );
      expect(await this.pool.linearPoolLength()).to.equal(2);


      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens to the 1st pool
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Alice deposits 200 tokens to the 2nd pool
      await this.pool
        .connect(this.alice)
        .linearDeposit(1, utils.parseEther("200"), { from: this.alice.address });
      expect(await this.pool.linearTotalStaked(1)).to.equal(utils.parseEther("200"));

      // Alice switches tokens from the 1st to the 2nd pool
      await this.pool
        .connect(this.alice)
        .linearSwitch(0, 1, { from: this.alice.address });
      expect(await this.pool.linearTotalStaked(1)).to.equal(utils.parseEther("300"));

      await this.pool
        .connect(this.alice)
        .linearWithdraw(1, utils.parseEther("300"), { from: this.alice.address })

      // Alice should not be able to claim withdraw after 10 days.
      await time.increase(duration.days(10).toNumber());
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearClaimPendingWithdraw(1, { from: this.alice.address }),
        "LinearStakingPool: not released yet"
      );

      // Alice should be able to withdraw after 4 more days.
      await time.increase(duration.days(4).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimPendingWithdraw(1, { from: this.alice.address });
    });
    it("should allow user to deposit for another user", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        0,
        0,
        duration.days(7).toNumber(),
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.years(1).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 tokens to the 1st pool
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));
      expect((await this.pool.linearStakingData(0, this.alice.address))['balance']).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens for Alice
      await this.pool
        .connect(this.bob)
        .linearDepositFor(0, utils.parseEther("200"), this.alice.address, { from: this.bob.address });

      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));
      expect((await this.pool.linearStakingData(0, this.alice.address))['balance']).to.equal(utils.parseEther("300"));
      expect((await this.pool.linearStakingData(0, this.bob.address))['balance']).to.equal(utils.parseEther("0"));

    });

  });

  context("With fixed pool", function () {
    beforeEach(async function () {
      await this.pkf.transfer(this.alice.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.bob.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.carol.address, utils.parseEther("1000"));
    });
    it("should distribute pkfs properly for each staker", async function () {
      // fixed pool with 20% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));

      // After 1 years
      await time.increase(duration.years(1).toNumber());
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearBalanceOf(0, this.alice.address)).to.equal(utils.parseEther("100"));
      expect(await this.pool.linearPendingReward(0, this.alice.address)).to.equal(utils.parseEther("20"));
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearBalanceOf(0, this.bob.address)).to.equal(utils.parseEther("200"));
      expect(await this.pool.linearPendingReward(0, this.bob.address)).to.equal(utils.parseEther("40"));

      // Alice withdraws 100 tokens. Alice should receive all the interest.
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 20% * 100 = 1020
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1020"));

      // Bob withdraws 100 tokens. Bob should receive all the interest.
      await this.pool
        .connect(this.bob)
        .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address });
      // Bob should have: 1000 + 20% * 200 = 1040
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("1040"));
    });
    it("should allow user to deposit multiple times", async function () {
      // fixed pool with 20% APR
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        365,
        duration.days(365).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(365).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // // After 100 days
      await time.increase(duration.days(100).toNumber());
      expect((await this.pool.linearBalanceOf(0, this.alice.address))).to.equal(utils.parseEther("100"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(Number("100").toFixed(2));

      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("200"));

      await time.increase(duration.days(100).toNumber());
      expect((await this.pool.linearBalanceOf(0, this.alice.address))).to.equal(utils.parseEther("200"));
      expect(Number(utils.formatEther(await this.pool.linearPendingReward(0, this.alice.address))).toFixed(2)).to.equal(Number("300").toFixed(2));

      // Alice should not be abot to withdraw after 366 days
      await time.increase(duration.days(166).toNumber());
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearWithdraw(0, utils.parseEther("200"), { from: this.alice.address }),
        "LinearStakingPool: still locked"
      );

      // Alice should not be abot to withdraw after 465 days
      await time.increase(duration.days(99).toNumber());
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("200"), { from: this.alice.address });

      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address))).toFixed(2)).to.equal(Number(utils.formatEther(BigNumber.from(
        utils.parseEther("1000")
          .add(utils.parseEther("100"))
          .add(utils.parseEther("200").mul("365").div("100"))
      ))).toFixed(2));

    });
    it("should not allow user to withdraw before lock time end", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      // Bob deposits 200 tokens
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("800"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("300"));

      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: still locked"
      );

      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address }),
        "LinearStakingPool: still locked"
      );

      // After 1 years
      await time.increase(duration.years(1).toNumber());

      // Alice withdraws 100 tokens 
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 20% * 100 = 1020
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("1020"));

      // Bob withdraws 100 tokens 
      await this.pool
        .connect(this.bob)
        .linearWithdraw(0, utils.parseEther("200"), { from: this.bob.address });
      // Bob should have: 1000 + 20% * 200 = 1040
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal(utils.parseEther("1040"));
    });
    it("should allow user to claim reward multiple times", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        365,
        duration.days(300).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });

      // Alice deposits 100 tokens
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address });

      expect(await this.pkf.balanceOf(this.alice.address)).to.equal(utils.parseEther("900"));
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("100"));

      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: still locked"
      );

      // Alice could claim reward at anytime
      await time.increase(duration.days(100).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      await time.increase(duration.days(100).toNumber());
      await this.pool
        .connect(this.alice)
        .linearClaimReward(0, { from: this.alice.address });

      // After 1 years
      await time.increase(duration.days(100).toNumber());

      // Alice withdraws 100 tokens 
      await this.pool
        .connect(this.alice)
        .linearWithdraw(0, utils.parseEther("100"), { from: this.alice.address });
      // Alice should have: 1000 + 1% * 300 * 100 = 1300
      // Allow a small amount of difference, due to the rounding in calculation
      // The amount of difference should be less than 250 wei
      expect(Number(utils.formatEther(await this.pkf.balanceOf(this.alice.address)))).to.equal(1300);

    });
    it("should not allow user to deposit after end join time", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        0,
        0,
        0,
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });

      await time.increase(duration.days(8).toNumber());
      // Alice should not be able to deposit
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: pool is already closed"
      );
      // Bob should not be able to deposit
      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address }),
        "LinearStakingPool: pool is already closed"
      );

    });
    it("should verify the staking amount correctly", async function () {
      this.pool = await upgrades.deployProxy(this.LinearPool, [this.pkf.address], {
        initializer: '__LinearPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("10000"));
      await this.pool.linearSetRewardDistributor(this.minter.address);
      await this.pool.linearAddPool(
        utils.parseEther("800"),
        utils.parseEther("200"),
        utils.parseEther("500"),
        20,
        duration.years(1).toNumber(),
        0,
        (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(7).toNumber()
      );

      await this.pkf.connect(this.alice).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.bob.address,
      });
      await this.pkf.connect(this.carol).approve(this.pool.address, utils.parseEther("1000"), {
        from: this.carol.address,
      });

      // Alice should not be able to deposit 100 token
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("100"), { from: this.alice.address }),
        "LinearStakingPool: insufficient amount"
      );

      // Alice should not be able to deposit 600 token
      await expectRevert(
        this.pool
          .connect(this.alice)
          .linearDeposit(0, utils.parseEther("600"), { from: this.alice.address }),
        "LinearStakingPool: too large amount"
      );

      // Alice should be able to deposit 500 token
      await this.pool
        .connect(this.alice)
        .linearDeposit(0, utils.parseEther("500"), { from: this.alice.address });

      // Bob should not be able to deposit 500 token
      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("500"), { from: this.bob.address }),
        "LinearStakingPool: pool is full"
      );

      // Bob should be able to deposit 250 token
      await this.pool
        .connect(this.bob)
        .linearDeposit(0, utils.parseEther("250"), { from: this.bob.address });
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("750"));

      // Bob should not be able to deposit 200 token
      await expectRevert(
        this.pool
          .connect(this.bob)
          .linearDeposit(0, utils.parseEther("200"), { from: this.bob.address }),
        "LinearStakingPool: pool is full"
      );
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("750"));

      // Carol should not be able to deposit 200 token
      await expectRevert(
        this.pool
          .connect(this.carol)
          .linearDeposit(0, utils.parseEther("200"), { from: this.carol.address }),
        "LinearStakingPool: pool is full"
      );
      expect(await this.pool.linearTotalStaked(0)).to.equal(utils.parseEther("750"));

      // Carol should not be able to deposit 50 token
      await expectRevert(
        this.pool
          .connect(this.carol)
          .linearDeposit(0, utils.parseEther("50"), { from: this.carol.address }),
        "LinearStakingPool: insufficient amount"
      );
    });

  });
});
