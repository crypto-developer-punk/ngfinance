import { types, flow } from "mobx-state-tree";
import Locking from './model/Locking';
import Nft from './model/Nft';
import NftWebThreeContext from './model/NftWebThreeContext';
import Reword from './model/Reword';
import Snapshot from './model/Snapshot';
import Staking from './model/Staking';
import WebThreeContext from "./model/WebThreeContext";
import requestBackend from 'api/requestBackend';
import requestWeb3 from 'api/requestWeb3';

const RootStore = types.model({
    name: types.optional(types.string, "test"),
    lockingMap: types.map(Locking),
    nftMap: types.map(Nft),
    nftWebThreeContextMap: types.map(NftWebThreeContext),
    rewordMap: types.map(Reword),
    snapshotMap: types.map(Snapshot),
    stakingMap: types.map(Staking),
    webThreeContext: types.optional(WebThreeContext, {}),    
}).actions(self => {
    return {
        setName(name) {
            console.log(name);
            self.name = name;
        },
        asyncInitWebThreeContext: flow(function* () {
            const networkInfo = yield requestWeb3.getNetworkInfo();
            self.webThreeContext.setNetworkInfo(networkInfo);
            const accounts = yield requestWeb3.getAccounts(); 
            self.webThreeContext.setAccounts(accounts);
            if (self.webThreeContext.isWalletConnected) {
                const balance = yield requestWeb3.getAccountBalance(self.webThreeContext.currentAccount);
                self.webThreeContext.setBalance(balance);
            }
        }),
        asyncRequestAuth: flow(function* () {
            const accounts = yield requestWeb3.requestAuth();
            self.webThreeContext.setAccounts(accounts);
        }),
        asyncInitNftInfos: flow(function* (webThreeContext){
            const {currentAccount, isWalletConnected} = webThreeContext;
            const res = yield requestBackend.getNftInfo(currentAccount);
            for (let i = 0; i < res.data.length; i++) {
                const nftDesc = res.data[i];
                const nft = Nft.create(nftDesc);
                self.nftMap.set(nft.id, nft);
                const nftBalance = isWalletConnected ? yield requestWeb3.getBalanceOfNft(nft.nft_chain_id, currentAccount) : "0";
                self.nftWebThreeContextMap.set(nft.id, NftWebThreeContext.create({id: nft.id, balance: nftBalance}));
            }
        })
    };
}).views(self => ({
    findNftWebThreeContext(id) {
        if (!self.nftWebThreeContextMap.has(id)) {
            return {id: -1, balance: 0};
        }
        return self.nftWebThreeContextMap.get(id);
    }
}));

const store = RootStore.create();

export default store;