import { types, flow } from "mobx-state-tree";
import Locking from './model/Locking';
import Nft from './model/Nft';
import Reword from './model/Reword';
import Snapshot from './model/Snapshot';
import Staking from './model/Staking';

const RootStore = types.model({
    name: types.optional(types.string, "test"),
    lockingMap: types.map(Locking),
    nftMap: types.map(Nft),
    rewordMap: types.map(Reword),
    snapshotMap: types.map(Snapshot),
    stakingMap: types.map(Staking),
}).actions(self => {
    return {
        setName(value) {
            self.name = value;
        },   
    };
});

const store = RootStore.create();

export default store;