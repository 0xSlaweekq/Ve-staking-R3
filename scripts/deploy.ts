import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Reward, TestERC20, Ve } from "../typechain";
import Web3 from "web3";
const hre = require("hardhat");

async function main() {
  const tokenFactory = await ethers.getContractFactory("TestERC20");
  const token = (await tokenFactory.deploy()) as TestERC20;

  console.log("Token deployed to:", token.address);

  const veNFTFactory = await ethers.getContractFactory("contracts/ve.sol:ve");
  const veNFT = (await veNFTFactory.deploy(token.address)) as Ve;

  console.log("Ve deployed to:", veNFT.address);

  const RewardFactory = await ethers.getContractFactory("Reward");
  const reward = (await RewardFactory.deploy(
    veNFT.address,
    token.address
  )) as Reward;

  console.log("Reward deployed to:", reward.address);

  // eslint-disable-next-line promise/param-names
  await new Promise((r) => setTimeout(r, 10000));

  await hre.run("verify:verify", {
    address: token.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: veNFT.address,
    constructorArguments: [token.address],
  });

  await hre.run("verify:verify", {
    address: reward.address,
    constructorArguments: [veNFT.address, token.address],
  });

  await token.mint(reward.address, Web3.utils.toWei("10000000", "ether")); // 100 mil

  await token.approve(veNFT.address, Web3.utils.toWei("100000000", "ether"));
  await token.approve(reward.address, Web3.utils.toWei("100000000", "ether"));

  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  const timestamp = block.timestamp;

  const week = 600;
  await reward.addEpochBatch(
    timestamp,
    week,
    10,
    Web3.utils.toWei("10000", "ether")
  );

  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");
  //
  // await greeter.deployed();
  //
  // console.log("Greeter deployed to:", greeter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
