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
                const blockNum = await ethers.provider.getBlockNumber();
                const block = await ethers.provider.getBlock(blockNum);
                const timestamp = block.timestamp;

                const week = 1800; // 30 mins
                await reward.addEpochBatch(
                    timestamp + 20,
                    week,
                    5,
                    Web3.utils.toWei('1000', 'ether')
                );

                await network.provider.send('evm_increaseTime', [Number(360)]);
                await network.provider.send('evm_mine'); // 6 min

                await veNFT.create_lock(Web3.utils.toWei('10', 'ether'), 3600);

                await network.provider.send('evm_increaseTime', [Number(240)]);
                await network.provider.send('evm_mine'); // 10 min

                await veNFT.create_lock(Web3.utils.toWei('1000', 'ether'), 3600);

                await network.provider.send('evm_increaseTime', [Number(4080)]);
                await network.provider.send('evm_mine'); // 1 h 18 min

                let currEpoch = await reward.getCurrentEpochId();
                let rewardA = await reward.pendingReward(1, 0, currEpoch);
                console.log('1: Might be 15.87', rewardA);
                let rewardB = await reward.pendingReward(2, 0, currEpoch);
                console.log('2:', rewardB);

                await reward['claimReward(uint256,uint256,uint256)'](1, 0, currEpoch);

                await network.provider.send('evm_increaseTime', [Number(180)]);
                await network.provider.send('evm_mine'); // 1 h 21 min

                currEpoch = await reward.getCurrentEpochId();
                rewardA = await reward.pendingReward(1, 0, currEpoch);
                console.log('before burn');
                console.log('1: ', rewardA);
                rewardB = await reward.pendingReward(2, 0, currEpoch);
                console.log('2:', rewardB);

                await veNFT.withdraw(1);

                console.log('right after burn');
                currEpoch = await reward.getCurrentEpochId();
                rewardB = await reward.pendingReward(2, 0, currEpoch);
                console.log('2:', rewardB);

                await network.provider.send('evm_increaseTime', [Number(240)]);
                await network.provider.send('evm_mine'); // 1 h 25 min

                console.log('1 h 25 m');
                currEpoch = await reward.getCurrentEpochId();
                rewardB = await reward.pendingReward(2, 0, currEpoch);
                console.log('2: might be zero ', rewardB);
            });
        });
    });
});
