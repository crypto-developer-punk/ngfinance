import { types, flow } from "mobx-state-tree";
import {values, map} from 'mobx';
import Locking from './model/Locking';
import Nft from './model/Nft';
import Reword from './model/Reword';
import OpenSaleUserState from "./model/OpenSaleUserState";
import OpenSaleNft from "./model/OpenSaleNft";
import Staking, {createStakingNullObject} from './model/Staking';
import WebThreeContext from "./model/WebThreeContext";
import requestBackend from 'api/requestBackend';
import requestWeb3 from 'api/requestWeb3';
import Snapshot from "./model/Snapshot";

import { TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_PAINT_POOL} from "myconstants";
import { assertSupportedTokenType, assertTransactionTimeoutError, assertNetworkIdAndWalletConnect, assertBalanceStrEmtpy } from "assertion";
import { NFT_CHAIN_NONE, CONTRACT_TYPE_1155 } from "myconstants";
import { environmentConfig } from 'myconfig';
import { sleep, MathHelper } from "myutil";

var _ = require('lodash');
var moment = require('moment')

const RootStore = types.model({
    name: types.optional(types.string, "test"),
    lockingMap: types.map(Locking),
    nftMap: types.map(Nft),
    rewordMap: types.map(Reword),
    snapshotMap: types.map(Snapshot),
    nftStakingMap: types.map(Staking),
    paintEthLpStaking: types.optional(Staking, {id: '-1'}), // NFT_CHAIN_NONE
    paintPoolStaking: types.optional(Staking, {id: '-1'}),
    webThreeContext: types.optional(WebThreeContext, {}),
    openSaleUserStateMap: types.map(OpenSaleUserState),
    openSaleNftMap: types.map(OpenSaleNft),
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
                const ethBalanceStr = yield requestWeb3.asyncGetEthBalanceStr(currentAccount);
                console.log('ethBalance', ethBalanceStr);
                self.webThreeContext.setEthBalanceStr(ethBalanceStr);
                const paintLpBalanceStr = yield requestWeb3.asyncGetBalanceStrOfPaintEthLP(currentAccount);
                console.log('paintLpBalanceStr', paintLpBalanceStr);
                self.webThreeContext.setPaintEthLpBalanceStr(paintLpBalanceStr);
                const paintPoolBalanceStr = yield requestWeb3.asyncGetBalanceStrOfPaintToken(currentAccount);
                self.webThreeContext.setPaintPoolBalanceStr(paintPoolBalanceStr);
                console.log('paintPoolBalanceStr', paintPoolBalanceStr);
            }
        }),
        clearWebThreeContext() {
            console.log('clearWebThreeContext');
            self.webThreeContext.setNetworkInfo({networkId:-1, networkName:""});
            self.webThreeContext.setAccounts([]);
            self.webThreeContext.setEthBalanceStr("0");
            self.webThreeContext.setPaintEthLpBalanceStr("0");
            self.webThreeContext.setPaintPoolBalanceStr("0");
        },
        asyncRequestAuth: flow(function* () {
            const accounts = yield requestWeb3.asyncRequestAuth();
            self.webThreeContext.setAccounts(accounts);
        }),
        asyncInitNftInfos: flow(function* (){
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            // assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const res = yield requestBackend.getNftInfo(currentAccount);
            for (let i = 0; i < res.data.length; i++) {
                const nftDesc = res.data[i];
                const nft = Nft.create(nftDesc);
                self.nftMap.set(nft.id, nft);
                // console.log('aaa', JSON.stringify(nft));
                if (!isWalletConnected)
                    continue;
                yield self.asyncUpdateNftBalance(nft);
                yield self.asyncUpdateNftStakingState(nft);
            }
        }),
        asyncInitSnapshots: flow(function* (){ 
            const {currentAccount, isWalletConnected, isValidNetwork, networkId} = self.webThreeContext;
            const isNotValidNetworkConnected = !isWalletConnected || !isValidNetwork;
            
            const {nft_paint_apw, paint_eth_apw, nft_canvas_apw, paint_singple_apw} = yield requestBackend.asyncGetRewardInfoAll(currentAccount);

            const paint_nft_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_PAINT_NFT); 
            const paint_total_value_locked_nft_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_PAINT_NFT);
            const paint_balance_of_reward = isNotValidNetworkConnected ? 0 : yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_PAINT_NFT);
            
            self.snapshotMap.set(TOKEN_TYPE_PAINT_NFT, Snapshot.create({
                snapshot_time: new Date(paint_nft_snapshot_time),
                total_value_locked_nft_amount: paint_total_value_locked_nft_amount,
                balance_of_reward: paint_balance_of_reward,
                reward_amount_per_week: nft_paint_apw
            }));

            const canvas_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_CANVAS_NFT); 
            const canvas_total_value_locked_nft_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_CANVAS_NFT);
            const canvas_balance_of_reward = isNotValidNetworkConnected ? 0 : yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_CANVAS_NFT);
            self.snapshotMap.set(TOKEN_TYPE_CANVAS_NFT, Snapshot.create({
                snapshot_time: new Date(canvas_snapshot_time),
                total_value_locked_nft_amount: canvas_total_value_locked_nft_amount,
                balance_of_reward: canvas_balance_of_reward,
                reward_amount_per_week: nft_canvas_apw
            }));

            const lp_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            const lp_total_value_locked_nft_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            const lp_balance_of_reward = isNotValidNetworkConnected ?  0 : yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            self.snapshotMap.set(TOKEN_TYPE_CANVAS_PAINT_ETH_LP, Snapshot.create({
                snapshot_time: new Date(lp_snapshot_time),
                total_value_locked_nft_amount: lp_total_value_locked_nft_amount,
                balance_of_reward: lp_balance_of_reward,
                reward_amount_per_week: paint_eth_apw
            }));
            
            const paint_pool_snapshot_time = yield requestBackend.asyncGetSnapshotTime(currentAccount, TOKEN_TYPE_PAINT_POOL);
            const paint_pool_value_locked_amount = yield requestBackend.asyncGetTotalValueLockedNftAmount(currentAccount, TOKEN_TYPE_PAINT_POOL); 
            const paint_pool_balance_of_reward = isNotValidNetworkConnected ? 0 : yield requestBackend.asyncGetReward(currentAccount, TOKEN_TYPE_PAINT_POOL); 
            console.log('aaa paint_pool_snapshot_time : ', paint_pool_snapshot_time);
            self.snapshotMap.set(TOKEN_TYPE_PAINT_POOL, Snapshot.create({
                snapshot_time: new Date(paint_pool_snapshot_time),
                total_value_locked_nft_amount: paint_pool_value_locked_amount,
                balance_of_reward: paint_pool_balance_of_reward,
                reward_amount_per_week: paint_singple_apw
            }));
            
            if (isNotValidNetworkConnected)
                return;
            yield self.asyncUpdatePaintEthLpStakingState();
            yield self.asyncUpdatePaintPoolStakingState();
        }),
        asyncInitOpensaleContext: flow(function* (){
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);
            
            OpenSaleNft.create({
                id: 1,
                nft_chain_id: 1,
                token_type: TOKEN_TYPE_CANVAS_NFT,
                subject: 'Metaverse',
                description: 'Metaverse',
                image_url: 'https://ngfinance.io/resources/metaverse.png',
                nft_url: 'https://rarible.com/token/0x6cff6eb6c7cc2409b48e6192f98914fd05aab4ba:21',
                contract_type: CONTRACT_TYPE_1155,
                price: 100000,
                price_unit: "paint",
                beg_timestamp: moment("2021-02-08 09:30:26").toDate(),
                end_timestamp: moment("2021-02-08 09:30:26").toDate(),
                tags: ["Utility NFT", "Paint", "Nostalgia Artist"]
            });
        }),
        asyncRegisterNftStaking: flow(function* (nft, stakingStepCB) {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);
            
            const {etherscan_url} = environmentConfig;
            const {nft_chain_id, contract_type, balanceStr, token_type} = nft;
            assertBalanceStrEmtpy(balanceStr);

            let transactionHash = '';
            console.log(`RegisterNftStaking 0 - currentAccount : ${currentAccount}, nft_chain_id : ${nft_chain_id}, balanceStr : ${balanceStr}`);
            if (stakingStepCB) stakingStepCB('Allow your contract.', '');

            let accTime = 0;
            let backendSizeRegisterStakingFinished = false;
            const ceiledBalanceStr = MathHelper.getLastPointNumberTrimedStr(balanceStr);

            yield requestWeb3.asyncRegisterNftStaking(currentAccount, contract_type, nft_chain_id, ceiledBalanceStr, (hash)=>{
                if (stakingStepCB) stakingStepCB('Doing contract. It take some times within 10 minutes.', etherscan_url + hash);
                transactionHash = hash;
                if (transactionHash) {
                    accTime = 0;
                    requestBackend.asyncRegisterStaking(currentAccount, contract_type, nft_chain_id, ceiledBalanceStr, token_type, transactionHash).then(res => {
                        backendSizeRegisterStakingFinished = true;
                    });   
                }
            });

            do {
                yield sleep(1000);
                if (backendSizeRegisterStakingFinished)
                    break;
                accTime += 1000;
                assertTransactionTimeoutError(accTime);    
            } while (true);

            console.log(`RegisterNftStaking 1 - asyncRegisterStaking`);
            if (stakingStepCB) stakingStepCB('Complete writing contract info. Almost done', etherscan_url + transactionHash);

            yield self.asyncUpdateNftBalance(nft);
            console.log(`RegisterNftStaking 2 - asyncUpdateNftBalance`);
            yield self.asyncUpdateNftStakingState(nft);
            console.log(`RegisterNftStaking 3 - asyncUpdateNftStakingState`);
            yield self.asyncInitSnapshots();
            console.log(`RegisterNftStaking 4 - asyncInitSnapshots`);
            if (stakingStepCB) stakingStepCB('Complete.', etherscan_url + transactionHash);
        }),
        asyncRegisterPaintTokenStaking: flow(function*(stakingStepCB) {
            const {currentAccount, isWalletConnected, networkId, paintPoolBalanceStr} = self.webThreeContext;            
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);
            assertBalanceStrEmtpy(paintPoolBalanceStr);

            const {etherscan_url} = environmentConfig;

            if (stakingStepCB) stakingStepCB('Allow your contract.', '');

            let accTime = 0;
            let backendSizeRegisterStakingFinished = false;
            let transactionHash = '';
            
            const ceiledBalanceStr = MathHelper.getLastPointNumberTrimedStr(paintPoolBalanceStr);
            console.log(`aaa paintPoolBalanceStr : ${paintPoolBalanceStr}, ceiledBalanceStr : ${ceiledBalanceStr}`);

            yield requestWeb3.asyncRegisterPaintPoolStaking(currentAccount, ceiledBalanceStr, (hash)=>{
                if (stakingStepCB) stakingStepCB('Doing contract. It take some times within 10 minutes.', etherscan_url + hash);
                transactionHash = hash;
                if (transactionHash) {
                    accTime = 0;
                    // TODO inner callback throw error not working
                    requestBackend.asyncRegisterStaking(currentAccount, CONTRACT_TYPE_1155, NFT_CHAIN_NONE, ceiledBalanceStr, TOKEN_TYPE_PAINT_POOL, transactionHash).then(res => {
                        backendSizeRegisterStakingFinished = true;
                    });
                }
            });

            do {
                yield sleep(1000);
                if (backendSizeRegisterStakingFinished)
                    break;
                accTime += 1000;
                assertTransactionTimeoutError(accTime);
            } while (true);
            
            const newPaintPoolBalanceStr = yield requestWeb3.asyncGetBalanceStrOfPaintToken(currentAccount);
            self.webThreeContext.setPaintPoolBalanceStr(newPaintPoolBalanceStr);
            console.log(`asyncRegisterPaintToeknStaking 1 - newPaintPoolBalanceStr : ${newPaintPoolBalanceStr}`);
            if (stakingStepCB) stakingStepCB('Complete updating LP token info. Almost done', etherscan_url + transactionHash);

            yield self.asyncInitSnapshots(); // call asyncUpdatePaintEthLpStakingState
            if (stakingStepCB) stakingStepCB('Complete.', etherscan_url + transactionHash);
        }),
        asyncRegisterPaintEthLpStaking: flow(function*(stakingStepCB) {
            const {currentAccount, isWalletConnected, networkId, paintEthLpBalanceStr} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);
            assertBalanceStrEmtpy(paintEthLpBalanceStr);
            console.log("paintEthLpBalanceStr", paintEthLpBalanceStr);            
            
            const {etherscan_url} = environmentConfig;
            
            let transactionHash = '';
            console.log('asyncRegisterPaintEthLpStaking 0');
            if (stakingStepCB) stakingStepCB('Allow your contract.', '');

            let accTime = 0;
            let backendSizeRegisterStakingFinished = false;
            const ceiledBalanceStr = MathHelper.getLastPointNumberTrimedStr(paintEthLpBalanceStr);

            yield requestWeb3.asyncRegisterPaintEthLpStaking(currentAccount, ceiledBalanceStr, (hash)=>{
                if (stakingStepCB) stakingStepCB('Doing contract. It take some times within 10 minutes.', etherscan_url + hash);
                transactionHash = hash;
                if (transactionHash) {
                    accTime = 0;
                    // TODO inner callback throw error not working
                    requestBackend.asyncRegisterStaking(currentAccount, CONTRACT_TYPE_1155, NFT_CHAIN_NONE, ceiledBalanceStr, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, transactionHash).then(res => {
                        backendSizeRegisterStakingFinished = true;
                    });
                }
            });

            do {
                yield sleep(1000);
                if (backendSizeRegisterStakingFinished)
                    break;
                accTime += 1000;
                assertTransactionTimeoutError(accTime);
            } while (true);

            const paintLpBalance = yield requestWeb3.asyncGetBalanceStrOfPaintEthLP(currentAccount);
            self.webThreeContext.setPaintEthLpBalanceStr(paintLpBalance);
            console.log(`asyncRegisterPaintEthLpStaking 1 - asyncGetBalanceStrOfPaintEthLP, paintLpBalance : ${paintLpBalance}`);
            if (stakingStepCB) stakingStepCB('Complete updating LP token info. Almost done', etherscan_url + transactionHash);

            yield self.asyncInitSnapshots(); // call asyncUpdatePaintEthLpStakingState
            if (stakingStepCB) stakingStepCB('Complete.', etherscan_url + transactionHash);
        }),
        asyncUpdateNftBalance: flow(function* (nft) {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const {nft_chain_id, contract_type} = nft;
            const newNftBalanceStr = yield requestWeb3.asyncGetBalanceStrOfNft(contract_type, nft_chain_id, currentAccount);
            nft.setBalanceStr(newNftBalanceStr);
        }), 
        asyncUpdateNftStakingState: flow(function* (nft){
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const {nft_chain_id, contract_type, uniqueKey, token_type} = nft;
            const {last_staked_time, token_amount} = yield requestBackend.asyncGetStaked(currentAccount, contract_type, nft_chain_id, token_type);
            if (!last_staked_time) return;
            
            self.nftStakingMap.set(uniqueKey, Staking.create({id: uniqueKey, last_staked_time: new Date(last_staked_time), token_amount}));
        }),
        asyncUpdatePaintEthLpStakingState: flow(function* () {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);
            
            const {last_staked_time, token_amount} = yield requestBackend.asyncGetStaked(currentAccount, CONTRACT_TYPE_1155, NFT_CHAIN_NONE, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            if (!last_staked_time) return;
            self.paintEthLpStaking.setStakedTime(new Date(last_staked_time));
            self.paintEthLpStaking.setTokenAmount(token_amount);
            console.log(`asyncUpdatePaintEthLpStakingState - last_staked_time : ${last_staked_time}, token_amount : ${token_amount}`);
        }),
        asyncUpdatePaintPoolStakingState: flow(function* () {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const {last_staked_time, token_amount} = yield requestBackend.asyncGetStaked(currentAccount, CONTRACT_TYPE_1155, NFT_CHAIN_NONE, TOKEN_TYPE_PAINT_POOL);
            if (!last_staked_time) return;
            self.paintPoolStaking.setStakedTime(new Date(last_staked_time));
            self.paintPoolStaking.setTokenAmount(token_amount);
            console.log(`asyncUpdatePaintPoolStakingState - last_staked_time : ${last_staked_time}, token_amount : ${token_amount}`);
        }),
        asyncUnstakeNft: flow(function* (nft, unstakingStepCB) {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const {nft_chain_id, contract_type, token_type} = nft;
            console.log(`Unstake 0 currentAccount : ${currentAccount}, nft_chain_id : ${nft_chain_id}, contract_type : ${contract_type}`);
            if (unstakingStepCB) unstakingStepCB('Doing contract. It take some times within 10 minutes.');

            yield requestBackend.asyncUnstaking(currentAccount, contract_type, nft_chain_id, token_type);
            console.log('Unstake 1 - asyncUnstaking');
            if (unstakingStepCB) unstakingStepCB('Complete contract. Try updating staking info');

            yield sleep(5000);

            yield self.asyncUpdateNftBalance(nft);
            console.log('Unstake 2 - asyncUpdateNftBalance');
            yield self.asyncUpdateNftStakingState(nft);
            console.log('Unstake 3 - asyncUpdateNftStakingState');
            yield self.asyncInitSnapshots();
            console.log('Unstake 4 - asyncInitSnapshots');
            if (unstakingStepCB) unstakingStepCB('Complete.');
        }),
        asyncUnstakePaintEthLp: flow(function* (unstakingStepCB) {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);
            
            const {etherscan_url} = environmentConfig;

            console.log(`asyncUnstakePaintEthLp 0 currentAccount : ${currentAccount}, NFT_CHAIN_NONE`);
            if (unstakingStepCB) unstakingStepCB('Doing contract. It take some times within 10 minutes.');

            yield requestBackend.asyncUnstaking(currentAccount, CONTRACT_TYPE_1155, NFT_CHAIN_NONE, TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
            console.log('asyncUnstakePaintEthLp 1 - asyncUnstaking');
            if (unstakingStepCB) unstakingStepCB('Complete contract. Try updating staking info');
            
            yield sleep(5000);

            const paintLpBalanceStr = yield requestWeb3.asyncGetBalanceStrOfPaintEthLP(currentAccount);
            self.webThreeContext.setPaintEthLpBalanceStr(paintLpBalanceStr);
            console.log(`asyncUnstakePaintEthLp 2 - asyncGetBalanceStrOfPaintEthLP, paintLpBalanceStr : ${paintLpBalanceStr}`);
            
            yield self.asyncInitSnapshots(); // call asyncUpdatePaintEthLpStakingState
            console.log('asyncUnstakePaintEthLp 3 - asyncInitSnapshots');
            if (unstakingStepCB) unstakingStepCB('Complete.');
        }),
        asyncUnstakePaintToken: flow(function* (unstakingStepCB) {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const {etherscan_url} = environmentConfig;

            console.log(`asyncUnstakePaintToken 0 currentAccount : ${currentAccount}, NFT_CHAIN_NONE`);
            if (unstakingStepCB) unstakingStepCB('Doing contract. It take some times within 10 minutes.');

            yield requestBackend.asyncUnstaking(currentAccount, CONTRACT_TYPE_1155, NFT_CHAIN_NONE, TOKEN_TYPE_PAINT_POOL);
            console.log('asyncUnstakePaintToken 1 - asyncUnstaking');
            if (unstakingStepCB) unstakingStepCB('Complete contract. Try updating staking info');
            
            yield sleep(5000);
            
            const newPaintPoolBalanceStr = yield requestWeb3.asyncGetBalanceStrOfPaintToken(currentAccount);
            self.webThreeContext.setPaintPoolBalanceStr(newPaintPoolBalanceStr);
            console.log(`asyncUnstakePaintToken 2 - asyncGetBalanceStrOfPaintToken, newPaintPoolBalanceStr : ${newPaintPoolBalanceStr}`);
        }),
        asyncClaimToken: flow(function* (token_type, claimStepCB) {
            assertSupportedTokenType(token_type);

            const {etherscan_url} = environmentConfig;
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            assertNetworkIdAndWalletConnect(networkId, isWalletConnected);

            const approvedTokenAmount = yield requestBackend.asyncApprove(currentAccount, 0, token_type);

            if (claimStepCB) claimStepCB('Allow your contract.', '');

            let transactionHash = '';

            let accTime = 0;
            let backendSizeRegisterStakingFinished = false;
            console.log('aaa approvedTokenAmount : ', approvedTokenAmount);
            yield requestWeb3.asyncClaimToken(currentAccount, token_type, approvedTokenAmount, (hash)=> {
                if (claimStepCB) claimStepCB('Doing claim contract. It take some times within 10 minutes.', etherscan_url + hash);
                transactionHash = hash;
                if (transactionHash) {
                    accTime = 0;
                    requestBackend.asyncClaim(currentAccount, 0, token_type, transactionHash).then(res => {
                        backendSizeRegisterStakingFinished = true;
                    });
                }
            });

            do {
                yield sleep(1000);
                if (backendSizeRegisterStakingFinished)
                    break;
                accTime += 1000;
                assertTransactionTimeoutError(accTime);
            } while (true);

            const balanceOfReward = yield requestBackend.asyncGetReward(currentAccount, token_type);
            self.findSnapshot(token_type).setBalanceOfReward(balanceOfReward);
            if (claimStepCB) claimStepCB('Complete.', etherscan_url + transactionHash);
        }),
        asyncTest: flow(function* () {
            const {currentAccount, isWalletConnected, networkId} = self.webThreeContext;
            const res = yield requestBackend.asyncGetRewardInfoAll();
            console.log('aaa', res);
        }),
    };
}).views(self => ({
    findNftStaking(nft) {
        // TODO FIND NFT STAKING 오류 수정 필요 
        const {uniqueKey} = nft;
        // if (!nft_chain_id) return createStakingNullObject();
        if (!self.nftStakingMap.has(uniqueKey)) {
            return createStakingNullObject();
        }
        return self.nftStakingMap.get(uniqueKey);
    },
    findSnapshot(token_type) {
        if (!self.snapshotMap.has(TOKEN_TYPE_PAINT_NFT)) {
            return Snapshot.create();
        }
        return self.snapshotMap.get(token_type);
    },
    get paintNftSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_PAINT_NFT)) {
            return Snapshot.create();
        } 
        return self.snapshotMap.get(TOKEN_TYPE_PAINT_NFT);
    },
    get canvasNftSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_CANVAS_NFT)) {
            return Snapshot.create();
        } 
        return self.snapshotMap.get(TOKEN_TYPE_CANVAS_NFT);
    },
    get paintPoolSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_PAINT_POOL)) {
            return Snapshot.create();
        }
        return self.snapshotMap.get(TOKEN_TYPE_PAINT_POOL);
    },  
    get lpSnapshot() {
        if (!self.snapshotMap.has(TOKEN_TYPE_CANVAS_PAINT_ETH_LP)) {
            return Snapshot.create();
        } 
        return self.snapshotMap.get(TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
    },
    get NFTArr() {
        return values(self.nftMap);
    },
    get OwnerNFTArr() {
        return values(self.nftMap).filter(nft => {
            const {uniqueKey, balanceStr} = nft;
            if (parseFloat(balanceStr) > 0)
                return true;
            if (!self.nftStakingMap.has(uniqueKey)) {
                return false;
            }            
            const nftStaking = self.nftStakingMap.get(uniqueKey);
            const {token_amount} = nftStaking;
            return token_amount > 0;
        });
    },
    getOwnedNftArr(targetTokenType) {
        return values(self.nftMap).filter(nft => {
            const {uniqueKey, balanceStr, token_type} = nft;
            if (token_type !== targetTokenType) {
                return false;
            }
            if (parseFloat(balanceStr) > 0)
                return true;
            if (!self.nftStakingMap.has(uniqueKey)) {
                return false;
            }            
            const nftStaking = self.nftStakingMap.get(uniqueKey);
            const {token_amount} = nftStaking;
            return token_amount > 0;
        });
    },
    getStakedNftCount(targetTokenType) {
        return values(self.nftMap).filter(nft => {
            const {uniqueKey, token_type} = nft;
            if (token_type !== targetTokenType) {
                return false;
            }
            if (!self.nftStakingMap.has(uniqueKey)) {
                return false;
            }            
            const nftStaking = self.nftStakingMap.get(uniqueKey);
            const {token_amount} = nftStaking;
            return token_amount > 0;
        }).length;
    },
    get NonStakedCanvasNftCount() {
        return self.getOwnedNftArr(TOKEN_TYPE_CANVAS_NFT).length - self.StakedCanvasNftCount;
    },
    get NonStakedPaintNftCount() {
        return self.getOwnedNftArr(TOKEN_TYPE_PAINT_NFT).length - self.StakedPaintNftCount;
    },
    get StakedCanvasNftCount() {
        return self.getStakedNftCount(TOKEN_TYPE_CANVAS_NFT);
    },
    get StakedPaintNftCount() {
        return self.getStakedNftCount(TOKEN_TYPE_PAINT_NFT);
    }
}));

const store = RootStore.create();

export default store;