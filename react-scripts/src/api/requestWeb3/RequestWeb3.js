import {timeout} from 'myutil';
import {ProviderHelper} from 'myutil';

const Web3 = require('web3');

class RequestWeb3 {
    constructor() {
        const provider = ProviderHelper.getProvider();
        this.providerName = ProviderHelper.getProviderName(provider);
        this.lib = new Web3(provider);
        this.timeout = 3000;
    }

    getAccounts = async() => {
        const accounts = await timeout(this.lib.eth.getAccounts(), this.timeout);
        return accounts;
    };
};

export default RequestWeb3;
