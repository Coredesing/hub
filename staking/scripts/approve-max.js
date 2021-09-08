const { ethers } = require("hardhat");
const { utils, constants } = ethers;

async function main() {

  const [deployer] = await ethers.getSigners();
  const proxyAddress = process.env.POOL_PROXY_ADDRESS;

  // Get contract factory
  const AcceptedToken = await ethers.getContractFactory(
    'ERC20Mock',
  );
  const tokenAddress = process.env.REWARD_TOKEN;

  const acceptedToken = AcceptedToken.attach(tokenAddress);

  const tx = await acceptedToken.connect(deployer).approve(proxyAddress, constants.MaxUint256);
  await tx.wait(5)

  const allowance = (await acceptedToken.allowance(deployer.address, proxyAddress));

  console.log("Allowance:", allowance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });