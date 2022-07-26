import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Reward, TestERC20, Ve } from "../typechain";
import Web3 from "web3";
const hre = require("hardhat");

async function main() {
  const tokenFactory = await ethers.getContractFactory("TestERC20");
  // const token1 = (await tokenFactory.deploy()) as TestERC20;
  //
  // console.log("Token deployed to:", token1.address);
  //
  // await new Promise((r) => setTimeout(r, 10000));
  //
  // const veNFTFactory = await ethers.getContractFactory("contracts/ve.sol:ve");
  // const veNFT = (await veNFTFactory.deploy(token1.address)) as Ve;
  //
  // console.log("Ve deployed to:", veNFT.address);
  //
  // await new Promise((r) => setTimeout(r, 10000));

  const RewardFactory = await ethers.getContractFactory("Reward");
  const reward1 = (await RewardFactory.deploy(
    '0x3BBF11E07cE979769da5f263Cb4f66dC88B5bBea',
    '0xd452d01C6348D3d5B35FA1d5500d23F8Ae65D6eA'
  )) as Reward;

  console.log("Reward deployed to:", reward1.address);

  // eslint-disable-next-line promise/param-names
  await new Promise((r) => setTimeout(r, 10000));

  // await hre.run("verify:verify", {
  //   address: '0xd452d01C6348D3d5B35FA1d5500d23F8Ae65D6eA',
  //   constructorArguments: [],
  // });
  //
  // await hre.run("verify:verify", {
  //   address: veNFT.address,
  //   constructorArguments: [token1.address],
  // });

  await hre.run("verify:verify", {
    address: reward1.address,
    constructorArguments: [
        '0x3BBF11E07cE979769da5f263Cb4f66dC88B5bBea',
        '0xd452d01C6348D3d5B35FA1d5500d23F8Ae65D6eA'
  ],
  });

  let token = (await tokenFactory.attach(
      '0xd452d01C6348D3d5B35FA1d5500d23F8Ae65D6eA'
    )) as TestERC20;

  // eslint-disable-next-line promise/param-names
  await new Promise((r) => setTimeout(r, 10000));

  await token.mint(reward1.address, Web3.utils.toWei("10000000", "ether")); // 100 mil
  // await token1.approve(veNFT.address, Web3.utils.toWei("100000000", "ether"));

  // eslint-disable-next-line promise/param-names
  await new Promise((r) => setTimeout(r, 10000));

  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  const timestamp = block.timestamp;

  const week = 604800; // 1 epoch
  await reward1.addEpochBatch(
    timestamp,
    week,
    4,
    Web3.utils.toWei("100000", "ether")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
