import { types, flow } from "mobx-state-tree";
import Locking from './model/Locking';
import Nft from './model/Nft';
import NftWebThreeContext from './model/NftWebThreeContext';
import Reword from './model/Reword';
import Staking, {createStakingNullObject} from './model/Staking';
import WebThreeContext from "./model/WebThreeContext";
import requestBackend from 'api/requestBackend';
import requestWeb3 from 'api/requestWeb3';
import {environmentConfig} from 'myconfig';
import { TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, isSupportedTokenType} from "myconstants";
import { CHAIN_ID_PAINT_ETH_LP_TOKEN, CONTRACT_TYPE_PAINT_ETH_LP_TOKEN } from "myconstants";
import { ERR_WALLET_IS_NOT_CONNECTED, ERR_UNSKAKING_INPROGRESS } from "myconstants";
import Snapshot from "./model/Snapshot";

var _ = require('lodash');

const RootStore = types.model({
    name: types.optional(types.string, "test"),
    lockingMap: types.map(Locking),
    nftMap: types.map(Nft),
    nftWebThreeContextMap: types.map(NftWebThreeContext),
    rewordMap: types.map(Reword),
    snapshotMap: types.map(Snapshot),
    nftStakingMap: types.map(Staking),
    paintEthLpStaking: types.optional(Staking, {id: CHAIN_ID_PAINT_ETH_LP_TOKEN}), // CHAIN_ID_PAINT_ETH_LP_TOKEN = -1
    webThreeContext: types.optional(WebThreeContext, {}),
}).actions(self => {
    return {
        setName(name) {
            console.log(name);
            self.name = name;
        },
        asyncInitWebThreeContext: flow(function* () {
            const networkInfo = yield requestWeb3.asyncGetNetworkInfo();
            self.webThreeContext.setNetworkInfo(networkInfo);
            const accounts = yield requestWeb3.asyncGetAccounts(); 
            self.webThreeContext.setAccounts(accounts);
            console.log('accounts', accounts);
            if (self.webThreeContext.isWalletConnected) {
                const {currentAccount} = self.webThreeContext;
                const ethBalance = yield requestWeb3.asyncGetEthBalance(currentAccount);
                console.log('ethBalance', ethBalance);
                self.webThreeContext.setEthBalance(ethBalance);
                const paintLpBalance = yield requestWeb3.asyncGetBalanceOfPaintEthLP(currentAccount);
                console.log('paintLpBalance', paintLpBalance);
                self.webThreeContext.setPaintEthLpBalance(paintLpBalance);
            }
        }),
        asyncRequestAuth: flow(function* () {
            const accounts = yield requestWeb3.asyncRequestAuth();
            self.webThreeContext.setAccounts(accounts);
        }),
        asyncInitNftInfos: flow(function* (){
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected) 
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};

            const res = yield requestBackend.getNftInfo(currentAccount);
            for (let i = 0; i < res.data.length; i++) {
                const nftDesc = res.data[i];
                const nft = Nft.create(nftDesc);
                self.nftMap.set(nft.id, nft);
                console.log(`asyncInitNftInfos - nftDesc : ${JSON.stringify(nftDesc)}`);
                const nftBalance = isWalletConnected ? yield requestWeb3.asyncGetBalanceOfNft(nft.nft_chain_id, currentAccount) : "0";
                self.nftWebThreeContextMap.set(nft.nft_chain_id, NftWebThreeContext.create({id: nft.nft_chain_id, balance: nftBalance}));
                yield self.asyncUpdateNftStakingState(nft);
            }
        }),
        asyncInitSnapshots: flow(function* (){ 
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected) 
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};

            const paint_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_PAINT_NFT); 
            const paint_total_value_locked_nft_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_PAINT_NFT);
            const paint_balance_of_reward = yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_PAINT_NFT);
            
            self.snapshotMap.set(TOKEN_TYPE_PAINT_NFT, Snapshot.create({
                snapshot_time: new Date(paint_snapshot_time),
                total_value_locked_nft_amount: paint_total_value_locked_nft_amount,
                balance_of_reward: paint_balance_of_reward,
            }));

            const canvas_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_CANVAS_NFT); 
            const canvas_total_value_locked_nft_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_CANVAS_NFT);
            const canvas_balance_of_reward = yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_CANVAS_NFT);
            self.snapshotMap.set(TOKEN_TYPE_CANVAS_NFT, Snapshot.create({
                snapshot_time: new Date(canvas_snapshot_time),
                total_value_locked_nft_amount: canvas_total_value_locked_nft_amount,
                balance_of_reward: canvas_balance_of_reward,
            }));

            const lp_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            const lp_total_value_locked_nft_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            const lp_balance_of_reward = yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            self.snapshotMap.set(TOKEN_TYPE_CANVAS_PAINT_ETH_LP, Snapshot.create({
                snapshot_time: new Date(lp_snapshot_time),
                total_value_locked_nft_amount: lp_total_value_locked_nft_amount,
                balance_of_reward: lp_balance_of_reward,
            }));

            self.asyncUpdatePaintEthLpStakingState();
        }),
        asyncRegisterNftStaking: flow(function* (nft, stakingStepCB) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};
            
            const {etherscan_url} = environmentConfig;
            const {nft_chain_id, contract_type} = nft;
            const nftWebThreeContext = self.nftWebThreeContextMap.get(nft_chain_id);
            if (!nftWebThreeContext)
                throw 'Target nft balance is empty'
            const {balance} = nftWebThreeContext;

            let transactionHash = '';
            console.log(`RegisterNftStaking 0 - currentAccount : ${currentAccount}, nft_chain_id : ${nft_chain_id}, balance : ${balance}`);
            if (stakingStepCB) stakingStepCB('Allow your contract.', '');

            yield requestWeb3.asyncRegisterNftStaking(currentAccount, nft_chain_id, balance, (hash)=>{
                if (stakingStepCB) stakingStepCB('Doing contract. it take some times within 10 minutes.', etherscan_url + hash);
                transactionHash = hash;
            });
            console.log(`RegisterNftStaking 1 - asyncRegisterNftStaking, transactionHash : ${transactionHash}`);
            if (stakingStepCB) stakingStepCB('Complete contract. try writing contract info.', etherscan_url + transactionHash);

            yield requestBackend.asyncRegisterStaking(currentAccount, contract_type, nft_chain_id, balance, transactionHash);
            console.log(`RegisterNftStaking 2 - asyncRegisterStaking`);
            if (stakingStepCB) stakingStepCB('Complete writing contract info. almost done', etherscan_url + transactionHash);

            yield self.asyncUpdateNftBalance(nft_chain_id);
            console.log(`RegisterNftStaking 3 - asyncUpdateNftBalance`);
            yield self.asyncUpdateNftStakingState(nft);
            console.log(`RegisterNftStaking 4 - asyncUpdateNftStakingState`);
            yield self.asyncInitSnapshots();
            console.log(`RegisterNftStaking 5 - asyncInitSnapshots`);
        }),
        asyncRegisterPaintEthLpStaking: flow(function*(stakingStepCB) {
            const {currentAccount, isWalletConnected, paintEthLpBalance} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};
            if (paintEthLpBalance <= 0) 
                throw 'Balance is empty';
            console.log("paintEthLpBalance", paintEthLpBalance);            
            const {etherscan_url} = environmentConfig;
            console.log('asyncRegisterPaintEthLpStaking 0');
            let transactionHash = '';
            yield requestWeb3.asyncRegisterPaintEthLpStaking(currentAccount, paintEthLpBalance, (hash)=>{
                if (stakingStepCB) stakingStepCB('Doing contract. it take some times within 10 minutes.', etherscan_url + hash);
                transactionHash = hash;
            });
            console.log(`asyncRegisterPaintEthLpStaking 1, transactionHash : ${transactionHash}`);
            if (stakingStepCB) stakingStepCB('Complete contract. try writing contract info.', etherscan_url + transactionHash);

            yield requestBackend.asyncRegisterStaking(currentAccount, CONTRACT_TYPE_PAINT_ETH_LP_TOKEN, CHAIN_ID_PAINT_ETH_LP_TOKEN, paintEthLpBalance, transactionHash);
            console.log(`asyncRegisterPaintEthLpStaking 2`);
            if (stakingStepCB) stakingStepCB('Complete writing contract info. almost done', etherscan_url + transactionHash);
        }),
        asyncUpdateNftBalance: flow(function* (nft_chain_id) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};
            
            const newNftBalance = yield requestWeb3.asyncGetBalanceOfNft(nft_chain_id, currentAccount);
            const nftWebThreeContext = self.nftWebThreeContextMap.get(nft_chain_id);
            nftWebThreeContext.setBalance(newNftBalance);
        }), 
        asyncUpdateNftStakingState: flow(function* (nft){
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};
            
            const {nft_chain_id, contract_type} = nft;
            const {last_staked_time, token_amount, in_progress} = yield requestBackend.asyncGetStaked(currentAccount, contract_type, nft_chain_id);
            if (!last_staked_time) return;
            self.nftStakingMap.set(nft_chain_id, Staking.create({id: nft_chain_id, last_staked_time: new Date(last_staked_time), token_amount}));
        }),
        asyncUpdatePaintEthLpStakingState: flow(function* () {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};

            const {last_staked_time, token_amount, in_progress} = yield requestBackend.asyncGetStaked(currentAccount, CONTRACT_TYPE_PAINT_ETH_LP_TOKEN, CHAIN_ID_PAINT_ETH_LP_TOKEN);
            if (!last_staked_time) return;
            self.paintEthLpStaking.setStakedTime(new Date(last_staked_time));
            self.paintEthLpStaking.setTokenAmount(token_amount);
            console.log(`asyncUpdatePaintEthLpStakingState - last_staked_time : ${last_staked_time}, token_amount : ${token_amount}`);
        }),
        asyncUnstakeNft: flow(function* (nft, unstakingStepCB) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};

            const {nft_chain_id, contract_type} = nft;
            console.log(`Unstake 0 currentAccount : ${currentAccount}, nft_chain_id : ${nft_chain_id}, contract_type : ${contract_type}`);
            if (unstakingStepCB) unstakingStepCB('Doing contract. it take some times within 10 minutes.');

            yield requestBackend.asyncUnstaking(currentAccount, contract_type, nft_chain_id);
            console.log('Unstake 1 - asyncUnstaking');
            if (unstakingStepCB) unstakingStepCB('Complete contract. try updating staking info');

            yield self.asyncUpdateNftBalance(nft_chain_id);
            console.log('Unstake 2 - asyncUpdateNftBalance');
            yield self.asyncUpdateNftStakingState(nft);
            console.log('Unstake 3 - asyncUpdateNftStakingState');
            yield self.asyncInitSnapshots();
            if (unstakingStepCB) unstakingStepCB('Complete.');
            console.log('Unstake 4 - asyncInitSnapshots');
        }),
        asyncUnstakePaintEthLp: flow(function* (unstakingStepCB) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};
            
            console.log(`asyncUnstakePaintEthLp 0 currentAccount : ${currentAccount}, CHAIN_ID_PAINT_ETH_LP_TOKEN : ${CHAIN_ID_PAINT_ETH_LP_TOKEN}`);
            if (unstakingStepCB) unstakingStepCB('Doing contract. it take some times within 10 minutes.');

            yield requestBackend.asyncUnstaking(currentAccount, CONTRACT_TYPE_PAINT_ETH_LP_TOKEN, CHAIN_ID_PAINT_ETH_LP_TOKEN);
            console.log('asyncUnstakePaintEthLp 1 - asyncUnstaking');
            if (unstakingStepCB) unstakingStepCB('Complete contract. try updating staking info');

            const paintLpBalance = yield requestWeb3.asyncGetBalanceOfPaintEthLP(currentAccount);
            self.webThreeContext.setPaintEthLpBalance(paintLpBalance);
            console.log(`asyncUnstakePaintEthLp 2 - asyncGetBalanceOfPaintEthLP, paintLpBalance : ${paintLpBalance}`);
            yield self.asyncInitSnapshots(); // call asyncUpdatePaintEthLpStakingState
            console.log('asyncUnstakePaintEthLp 3 - asyncInitSnapshots');
            if (unstakingStepCB) unstakingStepCB('Complete.');
        }),
        asyncClaimToken: flow(function* (token_type, transactionHashUrlCB) {
            if (!isSupportedTokenType(token_type)) 
                throw `token type value : ${token_type}, it is not supported.`;
            
            const {etherscan_url} = environmentConfig;
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected. Change to mainet.'};

            const approvedTokenAmount = yield requestBackend.asyncApprove(currentAccount, 0, token_type);
            
            let transactionHash = '';
            yield requestWeb3.asyncClaimToken(currentAccount, token_type, approvedTokenAmount, (hash)=> {
                if (transactionHashUrlCB) transactionHashUrlCB(etherscan_url + hash);
                transactionHash = hash;
            });
            
            yield requestBackend.asyncClaim(currentAccount, 0, token_type, transactionHash);
            
            const balanceOfReward = yield requestBackend.asyncGetReward(currentAccount, token_type);
            self.findSnapshot(token_type).setBalanceOfReward(balanceOfReward);
        }),
        // asyncTest1: flow(function* () {
        //     yield sleep(5000);
        //     console.log('asyncTest1');
        //     yield sleep(1000);
        // }),
        // asyncTest2: flow(function* () {
        //     yield sleep(1000);
        //     console.log('asyncTest2');
        // }),
    };
}).views(self => ({
    findNftWebThreeContext(nft) {
        const {nft_chain_id} = nft;
        if (!nft_chain_id) return {id: -1, balance: 0};
        if (!self.nftWebThreeContextMap.has(nft_chain_id)) {
            return {id: -1, balance: 0};
        }
        return self.nftWebThreeContextMap.get(nft_chain_id);
    },
    findNftStaking(nft) {
        const {nft_chain_id} = nft;
        if (!nft_chain_id) return createStakingNullObject();
        if (!self.nftStakingMap.has(nft_chain_id)) {
            return createStakingNullObject();
        }
        return self.nftStakingMap.get(nft_chain_id);
    },
    findSnapshot(token_type) {
        if (!self.snapshotMap.has(TOKEN_TYPE_PAINT_NFT)) {
            return Snapshot.create();
        }
        return self.snapshotMap.get(token_type);
    },
    get paintSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_PAINT_NFT)) {
            return Snapshot.create();
        } 
        return self.snapshotMap.get(TOKEN_TYPE_PAINT_NFT);
    },
    get canvasSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_CANVAS_NFT)) {
            return Snapshot.create();
        } 
        return self.snapshotMap.get(TOKEN_TYPE_CANVAS_NFT);
    },
    get lpSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_CANVAS_PAINT_ETH_LP)) {
            return Snapshot.create();
        } 
        return self.snapshotMap.get(TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
    }
}));

const store = RootStore.create();

export default store;