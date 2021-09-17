import { types, flow } from "mobx-state-tree";
import {values, map} from 'mobx';
import Locking from './model/Locking';
import Nft from './model/Nft';
import NftWebThreeContext from './model/NftWebThreeContext';
import Reword from './model/Reword';
import Snapshot from './model/Snapshot';
import Staking, {createStakingNullObject} from './model/Staking';
import WebThreeContext from "./model/WebThreeContext";
import BackendContext from "./model/BackendContext";
import requestBackend from 'api/requestBackend';
import requestWeb3 from 'api/requestWeb3';
import {environmentConfig} from 'myconfig';
import { TOKEN_TYPE_PAINT, TOKEN_TYPE_CANVAS } from "myconstants";

var _ = require('lodash');

const RootStore = types.model({
    name: types.optional(types.string, "test"),
    lockingMap: types.map(Locking),
    nftMap: types.map(Nft),
    nftWebThreeContextMap: types.map(NftWebThreeContext),
    rewordMap: types.map(Reword),
    snapshotMap: types.map(Snapshot),
    stakingMap: types.map(Staking),
    webThreeContext: types.optional(WebThreeContext, {}),    
    backendContext: types.optional(BackendContext, {})
}).actions(self => {
    return {
        setName(name) {
            console.log(name);
            self.name = name;
        },
        asyncInitMyContext: flow(function* () {
            yield self.asyncInitWebThreeContext();
            yield self.asyncInitBackendContext();
        }),
        asyncInitWebThreeContext: flow(function* () {
            const networkInfo = yield requestWeb3.asyncGetNetworkInfo();
            self.webThreeContext.setNetworkInfo(networkInfo);
            const accounts = yield requestWeb3.asyncGetAccounts(); 
            self.webThreeContext.setAccounts(accounts);
            if (self.webThreeContext.isWalletConnected) {
                const balance = yield requestWeb3.asyncGetAccountBalance(self.webThreeContext.currentAccount);
                self.webThreeContext.setBalance(balance);
            }
        }),
        asyncRequestAuth: flow(function* () {
            const accounts = yield requestWeb3.asyncRequestAuth();
            self.webThreeContext.setAccounts(accounts);
        }),
        asyncInitNftInfos: flow(function* (){
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            const res = yield requestBackend.getNftInfo(currentAccount);
            for (let i = 0; i < res.data.length; i++) {
                const nftDesc = res.data[i];
                const nft = Nft.create(nftDesc);
                self.nftMap.set(nft.id, nft);
                const nftBalance = isWalletConnected ? yield requestWeb3.asyncGetBalanceOfNft(nft.nft_chain_id, currentAccount) : "0";
                
                // For test
                // self.nftWebThreeContextMap.set(nft.nft_chain_id, NftWebThreeContext.create({id: nft.nft_chain_id, balance: "1"}));
                self.nftWebThreeContextMap.set(nft.nft_chain_id, NftWebThreeContext.create({id: nft.nft_chain_id, balance: nftBalance}));
                console.log('aaa 5', nft);
                yield self.asyncUpdateStakeState(nft.nft_chain_id);
            }
        }),
        asyncInitBackendContext: flow(function* (){ 
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected) {
                throw 'Wallet is not connected';
            }

            const {status, data} = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_PAINT);
            if (status !== 200)
                throw `asyncGetTotalValueLockedNftAmount - ${status} error`
            const {totalValueLockedNftAmount} = data[0];
            console.log("totalValueLockedNftAmount", totalValueLockedNftAmount);

            const {status : status_snapshot, data : data_snapshot} = yield requestBackend.asyncGetSnapshot(currentAccount, TOKEN_TYPE_PAINT); 
            if (status_snapshot !== 200)
                throw `asyncGetSnapshot - ${status_snapshot} error`
            const {snapshot_time} = data_snapshot[0]; 

            const {status : status_reward, data : data_reward} = yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_PAINT);
            if (!status_reward === 200)
                throw `asyncGetReward - ${status} error`;
            console.log('data_reward', data_reward);
            const tokenAmount = data_reward[0].token_amount || 0;
            console.log("reward token amount: " + tokenAmount);
            
            self.backendContext = BackendContext.create({totalValueLockedNftAmount, snapshot_time: new Date(snapshot_time), paintRewardTokenAmount: tokenAmount});

            yield self.asyncInitNftInfos();
        }),
        asyncRegisterNftStaking: flow(function* (nft, transactionHashUrlCB) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            const {etherscan_url} = environmentConfig;
            if (!isWalletConnected)
                throw 'Wallet is not connected';
            const {nft_chain_id} = nft;
            const nftWebThreeContext = self.nftWebThreeContextMap.get(nft_chain_id);
            if (!nftWebThreeContext)
                throw 'Target nft balance is empty'
            const {balance} = nftWebThreeContext;
            let transactionHash = '';
            
            // For test
            // yield requestWeb3.asyncMockRegisterNftStaking(currentAccount, nft_chain_id, balance, (hash)=>{
            //     if (transactionHashUrlCB) transactionHashUrlCB(etherscan_url + hash);
            //     transactionHash = hash;
            // });
            // nftWebThreeContext.setBalance("0");
            // self.stakingMap.set(nft_chain_id, {
            //     id: 1,
            //     address: currentAccount,
            //     staking_time: new Date(),
            //     unstaking_time: null,
            //     staked: 1,
            //     nft_amount: parseInt(balance),
            //     nft_chain_id: nft_chain_id,
            //     token_type: 0,
            //     staking_transaction_hash: transactionHash,
            //     unstaking_transaction_hash: null,
            // });
            // yield self.asyncInitBackendContext();

            yield requestWeb3.asyncRegisterNftStaking(currentAccount, nft_chain_id, balance, (hash)=>{
                if (transactionHashUrlCB) transactionHashUrlCB(etherscan_url + hash);
                transactionHash = hash;
            });
            yield requestBackend.asyncRegisterStaking(currentAccount, nft_chain_id, balance, transactionHash);
            yield self.asyncUpdateNftBalance(nft_chain_id);
            yield self.asyncUpdateStakeState(nft_chain_id);
            yield self.asyncInitBackendContext();
        }),
        asyncUpdateNftBalance: flow(function* (nft_chain_id) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw 'Wallet is not connected';
            const newNftBalance = yield requestWeb3.asyncGetBalanceOfNft(nft_chain_id, currentAccount);
            const nftWebThreeContext = self.nftWebThreeContextMap.get(nft_chain_id);
            nftWebThreeContext.setBalance(newNftBalance);
        }), 
        asyncUpdateStakeState: flow(function* (nft_chain_id){
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw 'Wallet is not connected';
            const {status, data} = yield requestBackend.asyncGetStaked(currentAccount, nft_chain_id);
            if (!status === 200)
                throw `asyncGetStaked - ${status} error`;
            if (!data) {
                return;
            }
            let stakingData = _.cloneDeep(data);
            console.log('bbb stakingData', data, nft_chain_id);
            stakingData.id = nft_chain_id;
            stakingData.last_staked_time = new Date(stakingData.last_staked_time);
            self.stakingMap.set(nft_chain_id, Staking.create(stakingData));
        }),
        asyncUnstakeNft: flow(function* (nft) {
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw 'Wallet is not connected';
            const {nft_chain_id} = nft;
            yield requestBackend.asyncUnstaking(currentAccount, nft_chain_id);
            yield self.asyncUpdateNftBalance(nft_chain_id);
            yield self.asyncUpdateStakeState(nft_chain_id);
            yield self.asyncInitBackendContext();
        }),
        asyncClaimPaintToken: flow(function* (transactionHashUrlCB){
            const {etherscan_url} = environmentConfig;
            const {currentAccount, isWalletConnected} = self.webThreeContext;
            if (!isWalletConnected)
                throw 'Wallet is not connected';
            const {status, data} = yield requestBackend.asyncApprove(currentAccount, 0, TOKEN_TYPE_PAINT);
            if (!status === 200)
                throw `asyncApprove - ${status} error`;
            const {approved_token_amount} = data;
            let transactionHash = '';
            yield requestWeb3.asyncClaimPaintToken(currentAccount, approved_token_amount, (hash)=> {
                if (transactionHashUrlCB) transactionHashUrlCB(etherscan_url + hash);
                transactionHash = hash;
            });
            yield requestBackend.asyncClaim(currentAccount, 0, TOKEN_TYPE_PAINT, transactionHash);
            const {status : status_reward, data : data_reward} = yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_PAINT);
            if (!status_reward === 200)
                throw `asyncGetReward - ${status} error`;
            const tokenAmount = data_reward[0].token_amount || 0;
            console.log("reward token amount: " + tokenAmount);
            self.backendContext.setPaintRewardTokenAmount(tokenAmount);
        }),
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
    findStaking(nft) {
        const {nft_chain_id} = nft;
        if (!nft_chain_id) return createStakingNullObject();
        if (!self.stakingMap.has(nft_chain_id)) {
            return createStakingNullObject();
        }
        return self.stakingMap.get(nft_chain_id);
    },
}));

const store = RootStore.create();

export default store;