import {timeout, ProviderHelper} from 'myutil';
import Config, {environmentConfig} from 'myconfig';

const Web3 = require('web3');

class RequestWeb3 {
    constructor() {
        const provider = ProviderHelper.getProvider();
        this.providerName = ProviderHelper.getProviderName(provider);
        this.lib = new Web3(provider);
        this.timeout = 3000;
        // TODO need work
        const ethNetwork = Config["production"].eth_network;
        this.lib_pro = new Web3(ethNetwork); 
    }

    getAccounts = async() => {
        const accounts = await timeout(this.lib.eth.getAccounts(), this.timeout);
        return accounts;
    };

    getAccountBalance = async(connected_addr) => {
        const balance = this.lib.utils.fromWei(await this.lib.eth.getBalance(connected_addr), 'ether');
        return balance;
    };

    getNetworkId = async() => {
        const networkId = await timeout(this.lib.eth.net.getId(), this.timeout);
        return networkId
    };

    getNetworkName = async() => {
        const networkId = await this.getNetworkId();
        return ProviderHelper.getNetworkName(networkId);
    };

    getNetworkInfo = async() => {
        const networkId = await this.getNetworkId();
        const networkName = ProviderHelper.getNetworkName(networkId);
        return {networkId, networkName};
    };
    
    requestAuth = async() => {
        if (this.lib.currentProvider.send !== undefined) {
            return new Promise((resolve, reject) => {
                const responseHandler = (error, response) => {
                    if (error || response.error) {
                        reject(error || response.error);
                    } else {
                        resolve(response.result);
                    }
                };
                const send = this.lib.currentProvider.send;
                send({ method: 'eth_requestAccounts' }, responseHandler);
            });
        } else return Promise.reject(new Error("Web3 provider doesn't support send method"));
    };

    getBalanceOfNft = async(nft_chain_id, connected_addr) => {
        const nftContract = await this.#getNftContract(connected_addr);
        const balanceOfNft = await nftContract.methods.balanceOf(connected_addr, nft_chain_id).call();
        return balanceOfNft;
    };

    #getNftContract = async(connected_addr) => {
        // TODO environmentConfig not works
        const {nftContractAbi, nftContractAddress, ETHERSCAN_IO_GAS_PRICE_URL} = environmentConfig;
        const nftContract = new this.lib.eth.Contract(nftContractAbi, nftContractAddress, {
            from: connected_addr,
            // gasPrice: await getFastGasPriceWei(ETHERSCAN_IO_GAS_PRICE_URL)
        });
        return nftContract;
    };

    // TODO 
    #getFastGasPriceWei = async(etherScanGasPriceUrl) => {

    };
};

export default RequestWeb3;
