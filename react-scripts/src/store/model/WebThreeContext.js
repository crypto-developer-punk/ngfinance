import {types} from 'mobx-state-tree';

const WebThreeContext = types.model('WebThreeContext', {
    accounts: types.optional(types.array(types.string), []),
    networkId: types.optional(types.number, -1),
    networkName: types.optional(types.string, ""),
    balance: types.optional(types.string, "0")
}).actions(self => ({
    setAccounts(accounts) {
        self.accounts = accounts;
    },
    setNetworkInfo(networkInfo) {
        const {networkId, networkName} = networkInfo;
        self.networkId = networkId;
        self.networkName = networkName;
    },
    setBalance(balance) {
        self.balance = balance;
    }
})).views(self => ({
    get isWalletConnected() {
        return self.isValidNetwork && self.accounts.length > 0;
    },
    get isValidNetwork() {
        return self.networkId === 1 || self.networkId === 4;
    },
    get currentAccount() {
        return self.accounts.length > 0 ? self.accounts[0] : null;
    },
}));

export default WebThreeContext;