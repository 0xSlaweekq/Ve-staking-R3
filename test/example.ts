import { ethers, network, waffle } from 'hardhat';
import { deployContractFixture } from './shared/fixtures';
import { Wallet } from '@ethersproject/wallet';
import { Ve, Reward, TestERC20 } from '../typechain';
import Web3 from 'web3';
import { expect } from 'chai';
import { DEADLINE } from './shared/consts';
import { BigNumber as BN, BigNumberish, ContractTransaction } from 'ethers';
const hre = require('hardhat');

const createFixtureLoader = waffle.createFixtureLoader;

describe('Tests', () => {
    let wallet: Wallet, other: Wallet;
    let token: TestERC20;
    let veNFT: Ve;
    let reward: Reward;

    let loadFixture: ReturnType<typeof createFixtureLoader>;

    before('create fixture loader', async () => {
        [wallet, other] = await (ethers as any).getSigners();
        loadFixture = createFixtureLoader([wallet, other]);
    });

    beforeEach('deploy fixture', async () => {
        ({ veNFT, reward, token } = await loadFixture(deployContractFixture));
    });

    // 3 month - 7890000
    // 6 month - 15780000
    // 9 month - 23670000
    // 12 month -31560000
    describe('#Tests', () => {
        describe('10 mil in pool', () => {
            it('Should do smth', async () => {
                await veNFT.create_lock(Web3.utils.toWei('1000', 'ether'), 15780000);
                await veNFT.create_lock(Web3.utils.toWei('1000', 'ether'), 31560000);
                const rewardA = await reward.getPendingRewardSingle(1, 0);
                console.log(rewardA);
                const rewardB = await reward.getPendingRewardSingle(2, 0);
                console.log(rewardB);
                const rewardC = await reward.getPendingRewardSingle(3, 0);
                console.log(rewardC);
            });
        });
    });
});
