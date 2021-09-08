const { ethers } = require("hardhat");
const { utils } = ethers;
const { expect } = require("chai");
const {
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
} = require('@openzeppelin/test-helpers');
const { advanceBlockTo, duration } = require("./utilities/time.js");
describe("Allocation Pool ", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.minter = this.signers[4];

    this.AllocPool = await ethers.getContractFactory("StakingPool");
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter);
  });
  beforeEach(async function () {
    this.RewardToken = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.pkf = await this.RewardToken.deploy("RewardToken", "RWT", "100000000000");
    await this.pkf.deployed();
  });

  // it("should set correct state variables", async function () {
  //   this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "1000", "0"]);
  //   await this.pool.deployed();

  //   await this.pkf.transferOwnership(this.pool.address);

  //   const pkf = await this.pool.pkf();
  //   const owner = await this.pkf.owner();

  //   expect(pkf).to.equal(this.pkf.address);
  //   expect(owner).to.equal(this.pool.address);
  // });
  context("With ERC/LP token added to the field", function () {
    beforeEach(async function () {
      this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000");

      await this.lp.transfer(this.alice.address, "1000");

      await this.lp.transfer(this.bob.address, "1000");

      await this.lp.transfer(this.carol.address, "1000");

      this.lp2 = await this.ERC20Mock.deploy("LPToken2", "LP2", "10000000000");

      await this.lp2.transfer(this.alice.address, "1000");

      await this.lp2.transfer(this.bob.address, "1000");

      await this.lp2.transfer(this.carol.address, "1000");
    });

    it("should allow emergency withdraw", async function () {
      // 100 per block farming rate starting at block 100
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "50"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();

      await this.pool.allocAddPool("100", this.lp.address, "0");

      await this.lp.connect(this.bob).approve(this.pool.address, "1000");

      await this.pool.connect(this.bob).allocDeposit(0, "100");

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("900");

      await expectRevert(
        this.pool.connect(this.bob).allocEmergencyWithdraw(0),
        "AllocStakingPool: emergency withdrawal is not allowed yet"
      );

      await this.pool.allocSetAllowEmergencyWithdraw(true);

      await this.pool.connect(this.bob).allocEmergencyWithdraw(0);

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000");
    });
    it("should allow user to compound reward", async function () {
      // 10 per block farming rate starting at block 100
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "10", "100"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pool.allocSetRewardDistributor(this.minter.address);

      await this.pkf.transfer(this.alice.address, "1000");
      await this.pkf.transfer(this.bob.address, "1000");

      await this.pool.allocAddPool("100", this.pkf.address, "0");
      await this.pkf.connect(this.alice).approve(this.pool.address, "1000", {
        from: this.alice.address,
      });
      await this.pkf.connect(this.bob).approve(this.pool.address, "1000", {
        from: this.bob.address,
      });

      // Alice deposits 100 PKFs at block 310
      await advanceBlockTo("109");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, "100", { from: this.alice.address });

      // Bob deposits 200 PKFs at block 120
      await advanceBlockTo("119");
      await this.pool
        .connect(this.bob)
        .allocDeposit(0, "200", { from: this.bob.address });
      expect(await this.pool.allocPendingReward(0, this.alice.address)).to.equal(
        "100"
      );

      // Alice compound reward at block 123. At this point:
      //   Alice should have: 100 + 10*10 + 3*1/3*10 = 210 PKFs staking
      await advanceBlockTo("122");
      await this.pool
        .connect(this.alice)
        .allocCompoundReward(0, { from: this.alice.address });

      expect((await this.pool.allocUserInfo(0, this.alice.address)).amount).to.equal("210");

      // Alice withdraws 210 LPs at block 130.
      // Alice should have 900 + 210 + 7 * 210/410 * 10 = 250
      await advanceBlockTo("129");
      await this.pool
        .connect(this.alice)
        .allocWithdraw(0, "210", true, { from: this.alice.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal("1145");


      // Bob withdraws 200 LPs at block 132.
      // Bob should have 800 + 200 + 3 * 2/3 * 10 + 7 * 200/410 * 10 + 2 * 10 = 1074
      await advanceBlockTo("131");
      await this.pool
        .connect(this.bob)
        .allocWithdraw(0, "200", true, { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("1074");
    });
    it("should not distribute pkfs if no one deposit", async function () {
      // 100 per block farming rate starting at block 200
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "200"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pool.allocSetRewardDistributor(this.minter.address);

      await this.pool.allocAddPool("100", this.lp.address, "0");
      await this.lp.connect(this.bob).approve(this.pool.address, "1000");
      await advanceBlockTo("199");
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("0");
      await advanceBlockTo("204");
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("0");
      await advanceBlockTo("209");
      await this.pool.connect(this.bob).allocDeposit(0, "10"); // block 210
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("0");

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("990");
      await advanceBlockTo("219");
      await this.pool.connect(this.bob).allocWithdraw(0, "10", true); // block 220
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000");
    });
    it("should distribute pkfs properly for each staker", async function () {
      // 100 per block farming rate starting at block 300
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "300"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pool.allocSetRewardDistributor(this.minter.address);

      await this.pool.allocAddPool("100", this.lp.address, "0");
      await this.lp.connect(this.alice).approve(this.pool.address, "1000", {
        from: this.alice.address,
      });
      await this.lp.connect(this.bob).approve(this.pool.address, "1000", {
        from: this.bob.address,
      });
      await this.lp.connect(this.carol).approve(this.pool.address, "1000", {
        from: this.carol.address,
      });
      // Alice deposits 10 LPs at block 310
      await advanceBlockTo("309");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, "10", { from: this.alice.address });
      // Bob deposits 20 LPs at block 314
      await advanceBlockTo("313");
      await this.pool
        .connect(this.bob)
        .allocDeposit(0, "20", { from: this.bob.address });
      expect(await this.pool.allocPendingReward(0, this.alice.address)).to.equal(
        "400"
      );
      // Carol deposits 30 LPs at block 318
      await advanceBlockTo("317");
      await this.pool
        .connect(this.carol)
        .allocDeposit(0, "30", { from: this.carol.address });
      // Alice deposits 10 more LPs at block 320. At this point:
      //   Alice should have: 4*100 + 4*1/3*100 + 2*1/6*100 = 566
      await advanceBlockTo("319");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, "10", { from: this.alice.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal("0");
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("0");
      expect(await this.pkf.balanceOf(this.carol.address)).to.equal("0");
      // Bob withdraws 5 LPs at block 330. At this point:
      //   Bob should have: 4*2/3*100 + 2*2/6*100 + 10*2/7*100 = 619
      await advanceBlockTo("329");
      await this.pool
        .connect(this.bob)
        .allocWithdraw(0, "5", { from: this.bob.address });
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal("0");
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("619");
      expect(await this.pkf.balanceOf(this.carol.address)).to.equal("0");
      // Alice withdraws 20 LPs at block 340.
      // Bob withdraws 15 LPs at block 350.
      // Carol withdraws 30 LPs at block 360.
      await advanceBlockTo("339");
      await this.pool
        .connect(this.alice)
        .allocWithdraw(0, "20", true, { from: this.alice.address });
      await advanceBlockTo("349");
      await this.pool
        .connect(this.bob)
        .allocWithdraw(0, "15", true, { from: this.bob.address });
      await advanceBlockTo("359");
      await this.pool
        .connect(this.carol)
        .allocWithdraw(0, "30", true, { from: this.carol.address });
      // Alice should have: 566 + 10*2/7*100 + 10*2/6.5*100 = 1159
      expect(await this.pkf.balanceOf(this.alice.address)).to.equal("1159");
      // Bob should have: 619 + 10*1.5/6.5 * 100 + 10*1.5/4.5*100 = 1183
      expect(await this.pkf.balanceOf(this.bob.address)).to.equal("1183");
      // Carol should have: 2*3/6*100 + 10*3/7*100 + 10*3/6.5*100 + 10*3/4.5*100 + 10*100 = 2657
      expect(await this.pkf.balanceOf(this.carol.address)).to.equal("2657");
      // All of them should have 1000 LPs back.
      expect(await this.lp.balanceOf(this.alice.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.carol.address)).to.equal("1000");
    });

    it("should give proper pkfs allocation to each pool", async function () {
      // 100 per block farming rate starting at block 400
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "400"], {
        initializer: '__StakingPool_init'
      });

      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pool.allocSetRewardDistributor(this.minter.address);

      await this.lp
        .connect(this.alice)
        .approve(this.pool.address, "1000", { from: this.alice.address });
      await this.lp2
        .connect(this.bob)
        .approve(this.pool.address, "1000", { from: this.bob.address });
      // Add first LP to the pool with allocation 1
      await this.pool.allocAddPool("10", this.lp.address, "0");
      // Alice deposits 10 LPs at block 410
      await advanceBlockTo("409");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, "10", { from: this.alice.address });
      // Add LP2 to the pool with allocation 2 at block 420
      await advanceBlockTo("419");
      await this.pool.allocAddPool("20", this.lp2.address, "0");
      // Alice should have 10*100 pending reward
      expect(await this.pool.allocPendingReward(0, this.alice.address)).to.equal(
        "1000"
      );
      // Bob deposits 10 LP2s at block 425
      await advanceBlockTo("424");
      await this.pool
        .connect(this.bob)
        .allocDeposit(1, "5", { from: this.bob.address });
      // Alice should have 1000 + 5*1/3*100 = 1166 pending reward
      expect(await this.pool.allocPendingReward(0, this.alice.address)).to.equal(
        "1166"
      );
      await advanceBlockTo("430");
      // At block 430. Bob should get 5*2/3*100 = 333. Alice should get ~166 more.
      expect(await this.pool.allocPendingReward(0, this.alice.address)).to.equal(
        "1333"
      );
      expect(await this.pool.allocPendingReward(1, this.bob.address)).to.equal("333");
      await this.pool.connect(this.bob).allocClaimReward(1);
      expect(await this.pool.allocPendingReward(1, this.bob.address)).to.equal("0");
    });
    it("should give give pkf token from all pool if allocClaimReward all", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "100"], {
        initializer: '__StakingPool_init'
      });
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pool.allocSetRewardDistributor(this.minter.address);

      await this.lp
        .connect(this.alice)
        .approve(this.pool.address, "1000", { from: this.alice.address });
      await this.lp2
        .connect(this.alice)
        .approve(this.pool.address, "1000", { from: this.alice.address });
      //add pool 0 with alloc = 100
      await this.pool.allocAddPool("100", this.lp.address, "0");
      //add pool 1 with alloc = 200
      await this.pool.allocAddPool("200", this.lp2.address, "0");
      // Alice deposits 10 LPs in pool 0 at block 200
      await advanceBlockTo("199");
      await this.pool.connect(this.alice).allocDeposit(0, "10");
      // Alice deposit 20 LPs in pool 1 at block 210
      await advanceBlockTo("209");
      await this.pool.connect(this.alice).allocDeposit(1, "20");
      //At block 220, Alice allocClaimReward all rewards
      await advanceBlockTo("219");
      await this.pool.connect(this.alice).allocClaimAll([0, 1]);
      //At this moment, Alice should have:
      //pool 0: 20 block 20 * 10 * 1/3
      //pool 1: 10 block 10 * 10 * 2/3
      //ppkt token of alice after havertAll is 132
      const aliBal = await this.pkf.balanceOf(this.alice.address);
      expect(aliBal).to.equal("132");
    });
  });


  context("With pending withdraw time", function () {
    beforeEach(async function () {
      this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000");

      await this.lp.transfer(this.alice.address, "1000");

      await this.lp.transfer(this.bob.address, "1000");

      await this.lp.transfer(this.carol.address, "1000");

      this.lp2 = await this.ERC20Mock.deploy("LPToken2", "LP2", "10000000000");

      await this.lp2.transfer(this.alice.address, "1000");

      await this.lp2.transfer(this.bob.address, "1000");

      await this.lp2.transfer(this.carol.address, "1000");
    });

    it("should allow emergency withdraw", async function () {
      // 100 per block farming rate starting at block 100
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "50"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();

      await this.pool.allocAddPool("100", this.lp.address, duration.days(10));

      await this.lp.connect(this.bob).approve(this.pool.address, "1000");

      await this.pool.connect(this.bob).allocDeposit(0, "100");

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("900");

      await expectRevert(
        this.pool.connect(this.bob).allocEmergencyWithdraw(0),
        "AllocStakingPool: emergency withdrawal is not allowed yet"
      );

      await this.pool.allocSetAllowEmergencyWithdraw(true);

      await this.pool.connect(this.bob).allocEmergencyWithdraw(0);

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000");
    });
    it("should not allow admin set delay duration too long", async function () {
      // 100 per block farming rate starting at block 100
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "100"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();

      await expectRevert(
        this.pool.allocAddPool("100", this.lp.address, duration.days(36)),
        "AllocStakingPool: delay duration is too long"
      );

      await this.pool.allocAddPool("100", this.lp.address, duration.days(15));

      await expectRevert(
        this.pool.allocSetPool("0", "100", duration.days(36)),
        "AllocStakingPool: delay duration is too long"
      );
    });
    it("should not allow user unstake before waiting pending withdraw time ", async function () {
      // 100 per block farming rate starting at block 300
      this.pool = await upgrades.deployProxy(this.AllocPool, [this.pkf.address, "100", "300"], {
        initializer: '__StakingPool_init'
      });
      await this.pool.deployed();
      await this.pkf.connect(this.minter).approve(this.pool.address, utils.parseEther("100000000000"));
      await this.pool.allocSetRewardDistributor(this.minter.address);

      await this.pkf.transfer(this.pool.address, "100000");
      // Add allocation pool with 10 days delay when making withdrawal
      await this.pool.allocAddPool("100", this.lp.address, duration.days(10));
      await this.lp.connect(this.alice).approve(this.pool.address, "1000", {
        from: this.alice.address,
      });
      // Alice deposits 10 LPs at block 310
      await advanceBlockTo("309");
      await this.pool
        .connect(this.alice)
        .allocDeposit(0, "10", { from: this.alice.address });

      // Alice should not received LP tokens yet
      await advanceBlockTo("350");
      await this.pool
        .connect(this.alice)
        .allocWithdraw(0, "10", true, { from: this.alice.address })
      expect(await this.lp.balanceOf(this.alice.address)).to.equal("990");

      // Alice should not be able to claim pending withdraw immediately.
      await expectRevert(
        this.pool
          .connect(this.alice)
          .allocClaimPendingWithdraw(0, { from: this.alice.address }),
        "AllocStakingPool: not released yet"
      );
      // Alice should not be able to claim pending withdraw after 7 days.
      await time.increase(duration.days(7).toNumber());
      await expectRevert(
        this.pool
          .connect(this.alice)
          .allocClaimPendingWithdraw(0, { from: this.alice.address }),
        "AllocStakingPool: not released yet"
      );
      // Alice should be able to claim pending withdraw after 10 days.
      await time.increase(duration.days(3).toNumber());
      await this.pool
        .connect(this.alice)
        .allocClaimPendingWithdraw(0, { from: this.alice.address });

      expect(await this.lp.balanceOf(this.alice.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.carol.address)).to.equal("1000");
    });
  });
});
