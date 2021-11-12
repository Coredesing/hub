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

describe("GameFi Box ", function () {
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
    this.NFTBox = await ethers.getContractFactory("GameFiBox");

    this.AcceptedToken = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.pkf = await this.AcceptedToken.deploy("PolkaFoundry", "PKF", utils.parseEther("1000000000"));
    await this.pkf.deployed();
  });

  context("With Upgrades Proxy", function () {
    beforeEach(async function () {
      await this.pkf.transfer(this.alice.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.bob.address, utils.parseEther("1000"));
      await this.pkf.transfer(this.carol.address, utils.parseEther("1000"));
    });

    it("should it work", async function () {
      const maxSupply = 90;
      const maxPerBatch = 50;

      this.box = await upgrades.deployProxy(this.NFTBox, [
          "GameFiBox", "BOX", "http://127.0.0.1/",
        this.signer.address, this.fundWallet.address, ZERO_ADDRESS, ZERO_ADDRESS], {
        initializer: '__GameFiBox_init'
      });
      await this.box.deployed();

      this.nft = await this.NFTContract.deploy("GameFiMock", "Mock");
      await this.nft.deployed();
      await this.nft.mint(maxSupply, this.box.address);

      await this.box.addSaleEvent(
        maxSupply, (await time.latest()).toNumber(),
        (await time.latest()).toNumber() + duration.days(1).toNumber(), maxPerBatch,
        ZERO_ADDRESS, 0, 0, false, true, false
      );
      await this.box.setSubBox(0, [30, 30, 30, 30, 30],
          [utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1")],
          [ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS])
      // await this.box.setPrices([ZERO_ADDRESS], [utils.parseEther("0.1")], [0])

      // alice buy 10
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, "0x0000", {
            value: utils.parseEther("1")
          }),
          "ECDSA: invalid signature length"
      );

      const message = web3.utils.soliditySha3(this.alice.address, 0, ZERO_ADDRESS, 10, 0);
      const messageRed = web3.utils.soliditySha3(this.alice.address, 0, ZERO_ADDRESS, 10, 1);
      const messageError = web3.utils.soliditySha3(this.alice.address, 0, this.pkf.address, 10, 0);
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageError))),
          "NFTBox: invalid token"
      );

      await this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })

      await this.box.setSuperLimit([ this.alice.address ], 20);
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("1") }),
          "NFTBox: Legends Rate limit exceeded"
      );
      await this.box.setSuperLimit([ this.alice.address ], 0);

      await this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("1") }),
          "NFTBox: SubBox Rate limit exceeded"
      );
      await this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageRed)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageRed)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 30, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      const messageBobGreen = web3.utils.soliditySha3(this.bob.address, 0, ZERO_ADDRESS, 10, 2);
      const messageBobRed = web3.utils.soliditySha3(this.bob.address, 0, ZERO_ADDRESS, 10, 1);
      await this.box.connect(this.bob).claimBox(0, ZERO_ADDRESS, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.bob).claimBox(0, ZERO_ADDRESS, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.bob).claimBox(0, ZERO_ADDRESS, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.bob).claimBox(0, ZERO_ADDRESS, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
              { value: utils.parseEther("1") }),
          "NFTBox: SubBox Rate limit exceeded"
      );
      await this.box.connect(this.bob).claimBox(0, ZERO_ADDRESS, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageBobRed)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.bob).claimBox(0, ZERO_ADDRESS, 30, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      // do not allow
      await expectRevert(
          this.box.connect(this.alice).transferFrom(this.alice.address, this.bob.address, 0),
          "NFTBox: Box is not allowed to transfer"
      );
      // allow
      await this.box.setAllowTransfer(true);
      await this.box.connect(this.alice).transferFrom(this.alice.address, this.bob.address, 0)
      await this.box.connect(this.bob).transferFrom(this.bob.address, this.alice.address, 0)
      await this.box.setAllowTransfer(false);

      const sale = await this.box.connect(this.alice).saleEvents(0)
      const balanceOf = await this.nft.balanceOf(this.box.address)
      const balanceBoxOfAlice = await this.box.balanceOf(this.alice.address)
      const balanceBoxOfBob = await this.box.balanceOf(this.bob.address)

      expect(maxSupply).to.equal(sale[0].toNumber());
      expect(maxSupply).to.equal(balanceOf.toNumber());
      expect(maxPerBatch).to.equal(balanceBoxOfAlice.toNumber());
      expect(maxPerBatch - 10).to.equal(balanceBoxOfBob.toNumber());

      // cannot claim before random
      await this.box.connect(this.alice).claimAllNFT()
      await this.box.connect(this.bob).claimAllNFT()

      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "NFTBox: Box has not been revealed"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(0),
          "NFTBox: User must be owner of boxId"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxPerBatch + 1),
          "NFTBox: Box has not been revealed"
      );

      // random
      await this.box.randomEvent(0);
      let existed = {}
      for (let index = 0; index < maxSupply; index++) {
        const box = await this.box.boxes(index);
        const NftId = box[1].toNumber()
        console.log(`link box ${index} to NFT ${NftId} with status: ${box[4]}`)

        expect(!!existed[NftId]).to.equal(false);
        existed[NftId] = true
      }
      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "NFTBox: NFT not found"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxPerBatch + 1),
          "NFTBox: NFT not found"
      );
      await this.box.setSaleEventAddress(0, this.nft.address)

      await this.box.connect(this.alice).claimNFT(0)
      await this.box.connect(this.alice).claimAllNFT()
      await this.box.connect(this.bob).claimAllNFT()
      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "ERC721: owner query for nonexistent token"
      );

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

      console.log('event 2')
      await this.box.addSaleEvent(
          maxPerBatch, (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.days(1).toNumber(), maxPerBatch,
          this.nft.address, 90, 90, false, true, false
      );
      await this.box.setSubBox(1, [maxPerBatch, maxPerBatch, maxPerBatch, maxPerBatch, maxPerBatch],
        [utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1")],
        [ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS]
      )

      // alice buy 10
      await expectRevert(
          this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 0, "0x0000", {
            value: utils.parseEther("1")
          }),
          "ECDSA: invalid signature length"
      );

      const messageEvent2 = web3.utils.soliditySha3(this.alice.address, 1, ZERO_ADDRESS, 10, 0);
      const messageEvent2Red = web3.utils.soliditySha3(this.alice.address, 1, ZERO_ADDRESS, 10, 1);
      await this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageEvent2Red)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageEvent2Red)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageEvent2Red)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(1, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
              { value: utils.parseEther("1") }),
          "NFTBox: Rate limit exceeded"
      );
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 30, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      await this.nft.mint(maxPerBatch, this.box.address);
      const sale1 = await this.box.connect(this.alice).saleEvents(1)
      const balanceOfEvent2 = await this.nft.balanceOf(this.box.address)
      const balanceBoxOfEvent2Alice = await this.box.balanceOf(this.alice.address)

      expect(maxPerBatch).to.equal(sale1[0].toNumber());
      expect(maxPerBatch).to.equal(balanceOfEvent2.toNumber());
      expect(maxPerBatch).to.equal(balanceBoxOfEvent2Alice.toNumber());

      // cannot claim before random
      await this.box.connect(this.alice).claimAllNFT()
      await expectRevert(
          this.box.connect(this.bob).claimAllNFT(),
          "NFTBox: User must buy box before claim"
      );

      await expectRevert(
          this.box.connect(this.alice).claimNFT(maxSupply),
          "NFTBox: Box has not been revealed"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxSupply),
          "NFTBox: User must be owner of boxId"
      );
      await expectRevert(
          this.box.connect(this.alice).claimNFT(maxSupply + 1),
          "NFTBox: Box has not been revealed"
      );

      // random
      await this.box.randomEvent(1);
      existed = {}
      for (let index = maxSupply; index < maxSupply + maxPerBatch; index++) {
        const box = await this.box.boxes(index);
        const NftId = box[1].toNumber()
        console.log(`link box ${index} to NFT ${NftId} with status: ${box[4]}`)

        expect(!!existed[NftId]).to.equal(false);
        existed[NftId] = true
      }
      await this.box.connect(this.alice).claimNFT(maxSupply)
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxSupply + 1),
          "NFTBox: User must be owner of boxId"
      );
      await this.box.connect(this.alice).claimAllNFT()
      await expectRevert(
          this.box.connect(this.alice).claimNFT(maxSupply),
          "ERC721: owner query for nonexistent token"
      );

      const balanceBoxOfEvent2AliceAfterClaim = await this.box.balanceOf(this.alice.address)
      const balanceNFTOfEvent2Alice = await this.nft.balanceOf(this.alice.address)

      expect(maxPerBatch + maxPerBatch).to.equal(balanceNFTOfEvent2Alice.toNumber());
      expect(0).to.equal(balanceBoxOfEvent2AliceAfterClaim.toNumber());

      existed = {}
      console.log('NFT of Alice', balanceNFTOfAlice.toNumber())
      for (let index = 0; index < balanceNFTOfAlice.toNumber(); index++) {
        const NftId = await this.nft.tokenOfOwnerByIndex(this.alice.address, index);
        expect(!!existed[NftId]).to.equal(false);
        console.log(`Alice is owner of NFT ${NftId}`)
        existed[NftId] = true
      }
    });

    it("should it work with ERC20 token", async function () {
      const maxSupply = 90;
      const maxPerBatch = 50;

      this.box = await upgrades.deployProxy(this.NFTBox, [
        "GameFiBox", "BOX", "http://127.0.0.1/",
        this.signer.address, this.fundWallet.address, ZERO_ADDRESS, ZERO_ADDRESS], {
        initializer: '__GameFiBox_init'
      });
      await this.box.deployed();

      this.nft = await this.NFTContract.deploy("GameFiMock", "Mock");
      await this.nft.deployed();
      await this.nft.mint(maxSupply, this.box.address);

      // approve
      await this.pkf.connect(this.alice).approve(this.box.address, utils.parseEther("100000000"))
      await this.pkf.connect(this.bob).approve(this.box.address, utils.parseEther("100000000"))

      await this.box.addSaleEvent(
          maxSupply, (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.days(1).toNumber(), maxPerBatch,
          ZERO_ADDRESS, 0, 0, false, true, false
      );
      await this.box.setSubBox(0, [30, 30, 30, 30, 30],
          [utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1")],
          [this.pkf.address, this.pkf.address, this.pkf.address, this.pkf.address, this.pkf.address]
      )
      // await this.box.setPrices([this.pkf.address], [utils.parseEther("0.1")], [0])

      // alice buy 10
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, "0x0000", {
            value: utils.parseEther("1")
          }),
          "ECDSA: invalid signature length"
      );

      const message = web3.utils.soliditySha3(this.alice.address, 0, this.pkf.address, 10, 0);
      const messageRed = web3.utils.soliditySha3(this.alice.address, 0, this.pkf.address, 10, 1);
      const messageError = web3.utils.soliditySha3(this.alice.address, 0, ZERO_ADDRESS, 10, 0);
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, ZERO_ADDRESS, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageError),
              { value: utils.parseEther("1") })),
          "NFTBox: invalid token"
      );

      await this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })

      await this.box.setSuperLimit([ this.alice.address ], 20);
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("1") }),
          "NFTBox: Legends Rate limit exceeded"
      );
      await this.box.setSuperLimit([ this.alice.address ], 0);

      await this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("1") }),
          "NFTBox: SubBox Rate limit exceeded"
      );
      await this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageRed)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(0, this.pkf.address, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageRed)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, this.pkf.address, 30, 0, this.signer.signMessage(ethers.utils.arrayify(message)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      const messageBobGreen = web3.utils.soliditySha3(this.bob.address, 0, this.pkf.address, 10, 2);
      const messageBobRed = web3.utils.soliditySha3(this.bob.address, 0, this.pkf.address, 10, 1);
      await this.box.connect(this.bob).claimBox(0, this.pkf.address, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.bob).claimBox(0, this.pkf.address, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.bob).claimBox(0, this.pkf.address, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.bob).claimBox(0, this.pkf.address, 10, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
              { value: utils.parseEther("1") }),
          "NFTBox: SubBox Rate limit exceeded"
      );
      await this.box.connect(this.bob).claimBox(0, this.pkf.address, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageBobRed)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.bob).claimBox(0, this.pkf.address, 30, 2, this.signer.signMessage(ethers.utils.arrayify(messageBobGreen)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      // do not allow
      await expectRevert(
          this.box.connect(this.alice).transferFrom(this.alice.address, this.bob.address, 0),
          "NFTBox: Box is not allowed to transfer"
      );
      // allow
      await this.box.setAllowTransfer(true);
      await this.box.connect(this.alice).transferFrom(this.alice.address, this.bob.address, 0)
      await this.box.connect(this.bob).transferFrom(this.bob.address, this.alice.address, 0)
      await this.box.setAllowTransfer(false);

      const sale = await this.box.connect(this.alice).saleEvents(0)
      const balanceOf = await this.nft.balanceOf(this.box.address)
      const balanceBoxOfAlice = await this.box.balanceOf(this.alice.address)
      const balanceBoxOfBob = await this.box.balanceOf(this.bob.address)

      expect(maxSupply).to.equal(sale[0].toNumber());
      expect(maxSupply).to.equal(balanceOf.toNumber());
      expect(maxPerBatch).to.equal(balanceBoxOfAlice.toNumber());
      expect(maxPerBatch - 10).to.equal(balanceBoxOfBob.toNumber());

      // cannot claim before random
      await this.box.connect(this.alice).claimAllNFT()
      await this.box.connect(this.bob).claimAllNFT()

      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "NFTBox: Box has not been revealed"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(0),
          "NFTBox: User must be owner of boxId"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxPerBatch + 1),
          "NFTBox: Box has not been revealed"
      );

      // random
      await this.box.randomEvent(0);
      let existed = {}
      for (let index = 0; index < maxSupply; index++) {
        const box = await this.box.boxes(index);
        const NftId = box[1].toNumber()
        console.log(`link box ${index} to NFT ${NftId} with status: ${box[4]}`)

        expect(!!existed[NftId]).to.equal(false);
        existed[NftId] = true
      }
      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "NFTBox: NFT not found"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxPerBatch + 1),
          "NFTBox: NFT not found"
      );
      await this.box.setSaleEventAddress(0, this.nft.address)

      await this.box.connect(this.alice).claimNFT(0)
      await this.box.connect(this.alice).claimAllNFT()
      await this.box.connect(this.bob).claimAllNFT()
      await expectRevert(
          this.box.connect(this.alice).claimNFT(0),
          "ERC721: owner query for nonexistent token"
      );

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

      console.log('event 2')
      await this.box.addSaleEvent(
          maxPerBatch, (await time.latest()).toNumber(),
          (await time.latest()).toNumber() + duration.days(1).toNumber(), maxPerBatch,
          this.nft.address, 90, 90, false, true, false
      );
      await this.box.setSubBox(1, [maxPerBatch, maxPerBatch, maxPerBatch, maxPerBatch, maxPerBatch],
          [utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1"), utils.parseEther("0.1")],
          [this.pkf.address, this.pkf.address, this.pkf.address, this.pkf.address, this.pkf.address]
      )

      // alice buy 10
      await expectRevert(
          this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 0, "0x0000", {
            value: utils.parseEther("1")
          }),
          "ECDSA: invalid signature length"
      );

      const messageEvent2 = web3.utils.soliditySha3(this.alice.address, 1, this.pkf.address, 10, 0);
      const messageEvent2Red = web3.utils.soliditySha3(this.alice.address, 1, this.pkf.address, 10, 1);
      await this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageEvent2Red)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageEvent2Red)),
          { value: utils.parseEther("1") })
      await this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 1, this.signer.signMessage(ethers.utils.arrayify(messageEvent2Red)),
          { value: utils.parseEther("1") })
      await expectRevert(
          this.box.connect(this.alice).claimBox(1, this.pkf.address, 10, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
              { value: utils.parseEther("1") }),
          "NFTBox: Rate limit exceeded"
      );
      await expectRevert(
          this.box.connect(this.alice).claimBox(0, this.pkf.address, 30, 0, this.signer.signMessage(ethers.utils.arrayify(messageEvent2)),
              { value: utils.parseEther("3") }),
          "NFTBox: Rate limit exceeded"
      );

      await this.nft.mint(maxPerBatch, this.box.address);
      const sale1 = await this.box.connect(this.alice).saleEvents(1)
      const balanceOfEvent2 = await this.nft.balanceOf(this.box.address)
      const balanceBoxOfEvent2Alice = await this.box.balanceOf(this.alice.address)

      expect(maxPerBatch).to.equal(sale1[0].toNumber());
      expect(maxPerBatch).to.equal(balanceOfEvent2.toNumber());
      expect(maxPerBatch).to.equal(balanceBoxOfEvent2Alice.toNumber());

      // cannot claim before random
      await this.box.connect(this.alice).claimAllNFT()
      await expectRevert(
          this.box.connect(this.bob).claimAllNFT(),
          "NFTBox: User must buy box before claim"
      );

      await expectRevert(
          this.box.connect(this.alice).claimNFT(maxSupply),
          "NFTBox: Box has not been revealed"
      );
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxSupply),
          "NFTBox: User must be owner of boxId"
      );
      await expectRevert(
          this.box.connect(this.alice).claimNFT(maxSupply + 1),
          "NFTBox: Box has not been revealed"
      );

      // random
      await this.box.randomEvent(1);
      existed = {}
      for (let index = maxSupply; index < maxSupply + maxPerBatch; index++) {
        const box = await this.box.boxes(index);
        const NftId = box[1].toNumber()
        console.log(`link box ${index} to NFT ${NftId} with status: ${box[4]}`)

        expect(!!existed[NftId]).to.equal(false);
        existed[NftId] = true
      }
      await this.box.connect(this.alice).claimNFT(maxSupply)
      await expectRevert(
          this.box.connect(this.bob).claimNFT(maxSupply + 1),
          "NFTBox: User must be owner of boxId"
      );
      await this.box.connect(this.alice).claimAllNFT()
      await expectRevert(
          this.box.connect(this.alice).claimNFT(maxSupply),
          "ERC721: owner query for nonexistent token"
      );

      const balanceBoxOfEvent2AliceAfterClaim = await this.box.balanceOf(this.alice.address)
      const balanceNFTOfEvent2Alice = await this.nft.balanceOf(this.alice.address)

      expect(maxPerBatch + maxPerBatch).to.equal(balanceNFTOfEvent2Alice.toNumber());
      expect(0).to.equal(balanceBoxOfEvent2AliceAfterClaim.toNumber());

      existed = {}
      console.log('NFT of Alice', balanceNFTOfAlice.toNumber())
      for (let index = 0; index < balanceNFTOfAlice.toNumber(); index++) {
        const NftId = await this.nft.tokenOfOwnerByIndex(this.alice.address, index);
        expect(!!existed[NftId]).to.equal(false);
        console.log(`Alice is owner of NFT ${NftId}`)
        existed[NftId] = true
      }
    });
  });
});
