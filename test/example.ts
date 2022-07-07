import { ethers, network, waffle } from "hardhat";
import { deployContractFixture } from "./shared/fixtures";
import { Wallet } from "@ethersproject/wallet";
import { Ve, Reward, TestERC20 } from "../typechain";
import Web3 from "web3";
import { expect } from "chai";
import { DEADLINE } from "./shared/consts";
import { BigNumber as BN, BigNumberish, ContractTransaction } from "ethers";
const hre = require("hardhat");

const createFixtureLoader = waffle.createFixtureLoader;

describe("Tests", () => {
  let wallet: Wallet, other: Wallet;
  let token: TestERC20;
  let veNFT: Ve;
  let reward: Reward;

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  before("create fixture loader", async () => {
    [wallet, other] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([wallet, other]);
  });

  beforeEach("deploy fixture", async () => {
    ({ veNFT, reward, token } = await loadFixture(deployContractFixture));
  });

  // 3 month - 7890000
  // 6 month - 15780000
  // 9 month - 23670000
  // 12 month -31560000
  describe("#Tests", () => {
    describe("10 mil in pool", () => {
      it("Should do smth", async () => {
        await veNFT.create_lock(Web3.utils.toWei("1000", "ether"), 7890000); // 3 month
        await veNFT.create_lock(Web3.utils.toWei("1000", "ether"), 15780000);
        await veNFT.create_lock(Web3.utils.toWei("1000", "ether"), 23670000);
        await veNFT.create_lock(Web3.utils.toWei("1000", "ether"), 31560000);
        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);

        console.log("epoch 1");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 1)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 1)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 1)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 1)).toString());
        console.log("");
        console.log("epoch 10");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 10)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 10)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 10)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 10)).toString());
        console.log("");
        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000 / 3)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);
        console.log("epoch 13");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 13)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 13)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 13)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 13)).toString());
        console.log("epoch 14");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 14)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 14)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 14)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 14)).toString());

        await reward.checkpointAndCheckEpoch(14);
        await network.provider.send("evm_increaseTime", [Number(7890000)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(14);

        console.log("epoch 16");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 16)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 16)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 16)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 16)).toString());
        console.log("epoch 17");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 17)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 17)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 17)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 17)).toString());

        console.log("epoch 19");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 19)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 19)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 19)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 19)).toString());

        console.log("epoch 25");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 25)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 25)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 25)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 25)).toString());

        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);

        console.log("epoch 30");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 30)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 30)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 30)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 30)).toString());

        console.log("epoch 40");
        console.log('3 month', (await reward.getPendingRewardSingle(1, 40)).toString());
        console.log('6 month', (await reward.getPendingRewardSingle(2, 40)).toString());
        console.log('9 month', (await reward.getPendingRewardSingle(3, 40)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(4, 40)).toString());
      });
      it.only("Should do smth", async () => {
        await veNFT.create_lock(Web3.utils.toWei("1000", "ether"), 15780000);
        await veNFT.create_lock(Web3.utils.toWei("1000", "ether"), 31560000);
        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000 / 3)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);

        console.log("epoch 1");
        console.log('6 month', (await reward.getPendingRewardSingle(1, 1)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(2, 1)).toString());
        console.log("");
        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000 / 3)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);
        console.log("epoch 7");
        console.log('6 month', (await reward.getPendingRewardSingle(1, 7)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(2, 7)).toString());
        console.log("");
        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000 / 3)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);
        console.log("epoch 11");
        console.log('6 month', (await reward.getPendingRewardSingle(1, 11)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(2, 11)).toString());
        console.log("");
        await reward.checkpointAndCheckEpoch(0);
        await network.provider.send("evm_increaseTime", [Number(7890000 / 2)]);
        await network.provider.send("evm_mine");
        await reward.checkpointAndCheckEpoch(0);
        console.log("epoch 13");
        console.log('6 month', (await reward.getPendingRewardSingle(1, 13)).toString());
        console.log('12 month', (await reward.getPendingRewardSingle(2, 13)).toString());
        console.log("");
      });
    });
  });
});
