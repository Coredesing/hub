const chai = require('chai');
const Web3 = require('web3');
const { upgrades, ethers } = require("hardhat");
const { utils, BigNumber } = ethers;
const { expect } = chai;
const { duration } = require("./utilities/time.js");
const web3 = new Web3()
const {
  expectRevert, // Assertions for transactions that should fail
  time,
} = require('@openzeppelin/test-helpers');
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const DEFAULT_KEY_HASH = "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186";

describe("NFT Box ", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.minter = this.signers[3];
    this.signer = this.signers[4];
    this.fundWallet = this.signers[5];
    this.nft = ZERO_ADDRESS;
    this.NFTContract = await ethers.getContractFactory("GameFIMock");
    this.NFTBox = await ethers.getContractFactory("NFTBox");
  });
  beforeEach(async function () {});

  context("With Upgrades Proxy", function () {
    beforeEach(async function () {
    });

    it("should it work", async function () {
      const maxSupply = 90;
      const maxPerBatch = 50;

      this.box = await upgrades.deployProxy(this.NFTBox, [
          "NFTBox", "BOX", "http://127.0.0.1/",
        this.signer.address, this.fundWallet.address, ZERO_ADDRESS, ZERO_ADDRESS, DEFAULT_KEY_HASH], {
        initializer: '__NFTBox_init'
      });
      await this.box.deployed();

      this.nft = await this.NFTContract.deploy("GameFiMock", "Mock");
      await this.nft.deployed();
      await this.nft.mint(maxSupply, this.box.address);

      await this.box.addSaleEvent(
        maxSupply, utils.parseEther("0.1"), (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(1).toNumber(), maxPerBatch,
        this.nft.address, 0, 0, false, true
      );
      await this.box.setSubBox(0, [30, 30, 30, 30, 30])

      // alice buy 10
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, 10, 0, "0x0000", {
            value: utils.parseEther("1")
          }),
          "ECDSA: invalid signature length"
      );

      const message = web3.utils.soliditySha3(this.alice.address, 0, 10, 0);
      const messageRed = web3.utils.soliditySha3(this.alice.address, 0, 10, 1);
      await this.box.connect(this.alice).claimBox(0, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("1") }),
          "NFTBox: SubBox Rate limit exceeded"
      );
      await this.box.connect(this.alice).claimBox(0, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageRed)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageRed)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, 30, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      const messageBobGreen = web3.utils.soliditySha3(this.bob.address, 0, 10, 2);
      const messageBobRed = web3.utils.soliditySha3(this.bob.address, 0, 10, 1);
      await this.box.connect(this.bob).claimBox(0, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.bob).claimBox(0, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.bob).claimBox(0, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.bob).claimBox(0, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
              { value: utils.parseEther("1") }),
          "NFTBox: SubBox Rate limit exceeded"
      );
      await this.box.connect(this.bob).claimBox(0, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageBobRed)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.bob).claimBox(0, 30, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      const sale = await this.box.connect(this.alice).saleEvents(0)
      const balanceOf = await this.nft.balanceOf(this.box.address)
      const balanceBoxOfAlice = await this.box.balanceOf(this.alice.address)
      const balanceBoxOfBob = await this.box.balanceOf(this.bob.address)

      expect(maxSupply).to.equal(sale[0].toNumber());
      expect(maxSupply).to.equal(balanceOf.toNumber());
      expect(maxPerBatch).to.equal(balanceBoxOfAlice.toNumber());
      expect(maxPerBatch - 10).to.equal(balanceBoxOfBob.toNumber());

      // cannot claim before random
      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "NFTBox: Sale has not ended"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(0),
          "NFTBox: Sale has not ended"
      );

      // random
      await this.box.randomEvent(0);
      let existed = {}
      for (let index = 0; index < maxSupply; index++) {
        const box = await this.box.boxes(index);
        const NftId = box[1].toNumber()
        console.log(`link box ${index} to NFT ${NftId} with status: ${box[2]}`)

        expect(!!existed[NftId]).to.equal(false);
        existed[NftId] = true
      }

      await this.box.connect(this.alice).claimNFT(0)
      await this.box.connect(this.bob).claimNFT(0)
      const balanceBoxOfAliceAfterClaim = await this.box.balanceOf(this.alice.address)
      const balanceBoxOfBobAfterClaim = await this.box.balanceOf(this.bob.address)
      const balanceNFTOfAlice = await this.nft.balanceOf(this.alice.address)
      const balanceNFTOfBob = await this.nft.balanceOf(this.bob.address)

      expect(maxPerBatch).to.equal(balanceNFTOfAlice.toNumber());
      expect(maxPerBatch - 10).to.equal(balanceNFTOfBob.toNumber());
      expect(0).to.equal(balanceBoxOfAliceAfterClaim.toNumber());
      expect(0).to.equal(balanceBoxOfBobAfterClaim.toNumber());

      existed = {}
      console.log('NFT of Alice', balanceNFTOfAlice.toNumber())
      for (let index = 0; index < balanceNFTOfAlice.toNumber(); index++) {
        const NftId = await this.nft.tokenOfOwnerByIndex(this.alice.address, index);
        expect(!!existed[NftId]).to.equal(false);
        console.log(`Alice is owner of NFT ${NftId}`)
        existed[NftId] = true
      }

      console.log('NFT of Bob', balanceNFTOfBob.toNumber())
      for (let index = 0; index < balanceNFTOfBob.toNumber(); index++) {
        const NftId = await this.nft.tokenOfOwnerByIndex(this.bob.address, index);
        expect(!!existed[NftId]).to.equal(false);
        console.log(`Bob is owner of NFT ${NftId}`)
        existed[NftId] = true
      }
    });
  });
});
