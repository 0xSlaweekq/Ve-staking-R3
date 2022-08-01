import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Reward, TestERC20, Ve } from "../typechain";
import Web3 from "web3";
const hre = require("hardhat");

async function main() {
  // const tokenFactory = await ethers.getContractFactory("TestERC20");
  const veNFTFactory = await ethers.getContractFactory("contracts/ve.sol:ve");
  const veNFT = (await veNFTFactory.deploy('0x8E3BCC334657560253B83f08331d85267316e08a')) as Ve;

  console.log("Ve deployed to:", veNFT.address);

  await new Promise((r) => setTimeout(r, 10000));

  const RewardFactory = await ethers.getContractFactory("Reward");
  const reward1 = (await RewardFactory.deploy(
    veNFT.address,
    '0x8E3BCC334657560253B83f08331d85267316e08a'
  )) as Reward;

  console.log("Reward deployed to:", reward1.address);

  // eslint-disable-next-line promise/param-names
  // await new Promise((r) => setTimeout(r, 10000));

  await hre.run("verify:verify", {
    address: veNFT.address,
    constructorArguments: ['0x8E3BCC334657560253B83f08331d85267316e08a'],
  });

  await hre.run("verify:verify", {
    address: reward1.address,
    constructorArguments: [
        veNFT.address,
        '0x8E3BCC334657560253B83f08331d85267316e08a'
  ],
  });

  // let token = (await tokenFactory.attach(
  //     '0x8E3BCC334657560253B83f08331d85267316e08a'
  //   )) as TestERC20;

  // await token.mint(reward1.address, Web3.utils.toWei("10000000", "ether")); // 100 mil

  // eslint-disable-next-line promise/param-names
  // await new Promise((r) => setTimeout(r, 10000));

  // await token.approve(veNFT.address, Web3.utils.toWei("100000000", "ether"));

  // eslint-disable-next-line promise/param-names
  // await new Promise((r) => setTimeout(r, 10000));

  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  const timestamp = block.timestamp;

  const week = 604800; // 1 epoch
  await reward1.addEpoch(timestamp+60*15, timestamp+week+60*15, Web3.utils.toWei('1', 'ether'));

  // await reward1.addEpochBatch(
  //   timestamp,
  //   week,
  //   50,
  //   Web3.utils.toWei("100000", "ether")
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
