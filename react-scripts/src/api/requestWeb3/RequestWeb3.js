import axios from "axios";
import {timeout, ProviderHelper} from 'myutil';
import Config, {environmentConfig} from 'myconfig';

const Web3 = require('web3');

class RequestWeb3 {
    constructor() {
        this.reinitialize();
    }

    reinitialize() {
        const provider = ProviderHelper.getProvider();
        this.providerName = ProviderHelper.getProviderName(provider);
        this.lib = new Web3(provider);
        this.timeout = 3000;
    }

    asyncGetAccounts = async() => {
        const accounts = await timeout(this.lib.eth.getAccounts(), this.timeout);
        return accounts;
    };

    asyncGetAccountBalance = async(connected_addr) => {
        const balance = this.lib.utils.fromWei(await this.lib.eth.getBalance(connected_addr), 'ether');
        return balance;
    };

    asyncGetNetworkId = async() => {
        const networkId = await timeout(this.lib.eth.net.getId(), this.timeout);
        return networkId
    };

    asyncGetNetworkName = async() => {
        const networkId = await this.asyncGetNetworkId();
        return ProviderHelper.getNetworkName(networkId);
    };

    asyncGetNetworkInfo = async() => {
        const networkId = await this.asyncGetNetworkId();
        const networkName = ProviderHelper.getNetworkName(networkId);
        return {networkId, networkName};
    };
    
    asyncRequestAuth = async() => {
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

    asyncClaimPaintToken = async(connected_addr, approved_token_amount, transactionHashCB) => {
        const {PAINT_TOKEN_CONTRACT_ABI, PAINT_TOKEN_CONTRACT_ADDRESS, toStakingAddress, ETHERSCAN_IO_GAS_PRICE_URL} = environmentConfig;
        let contract = new this.lib.eth.Contract(PAINT_TOKEN_CONTRACT_ABI, PAINT_TOKEN_CONTRACT_ADDRESS, {
            from: connected_addr
          });
        let tokenAmount = await contract.methods.allowance(toStakingAddress, connected_addr).call();
        console.log("requestTransferFromPaintToken > allowance token amount: " + tokenAmount);
        console.log("requestTransferFromPaintToken > approved token amount: " + approved_token_amount);
        contract = new this.lib.eth.Contract(PAINT_TOKEN_CONTRACT_ABI, PAINT_TOKEN_CONTRACT_ADDRESS, {
            from: connected_addr, // default from address
            gasPrice: await this.#asyncGetFastGasPriceWei(ETHERSCAN_IO_GAS_PRICE_URL)
          });
          
        const receipt = contract.methods.transferFrom(toStakingAddress, connected_addr, this.lib.utils.toWei(approved_token_amount.toString(), 'ether')).send()
          .on('transactionHash', function(hash){
            if (transactionHashCB) transactionHashCB(hash);
          });
        return receipt;
    };

    asyncGetBalanceOfNft = async(nft_chain_id, connected_addr) => {
        const nftContract = await this.#asyncGetNftContract(connected_addr, false);
        const balanceOfNft = await nftContract.methods.balanceOf(connected_addr, nft_chain_id).call();
        return balanceOfNft;
    };

    asyncRegisterNftStaking = async(fromAddress, nft_chain_id, amountOfNft, transactionHashCB) => {
        const {toStakingAddress} = environmentConfig;
        return await this.asyncSafeTransfer(fromAddress, toStakingAddress, nft_chain_id, amountOfNft, (hash)=>{
            if (transactionHashCB) transactionHashCB(hash);
        });
    };

    asyncMockRegisterNftStaking = async(fromAddress, nft_chain_id, amountOfNft, transactionHashCB) => {
        setTimeout(()=>{
            transactionHashCB("0xd6293f6d012b93c2efd9c65df48606a3022d6d51db159b7a36fc6c7981310892");
        }, 2000);
        return {};
    };

    // https://web3js.readthedocs.io/en/v1.2.2/web3-eth-contract.html#methods-mymethod-send
    asyncSafeTransfer = async(connected_addr, toAddress, nft_chain_id, amountOfNft, transactionHashCB) => {
        const nftContract = await this.#asyncGetNftContract(connected_addr, true);
        const receipt = await nftContract.method.safeTransfer(connected_addr, toAddress, nft_chain_id, amountOfNft, "0x00").send()
            .on('transactionHash', (hash)=>{
                if (transactionHashCB) transactionHashCB(hash);                
            });
        return receipt;
    };

    #asyncGetNftContract = async(connected_addr, fast) => {
        const {nftContractAbi, nftContractAddress, ETHERSCAN_IO_GAS_PRICE_URL} = environmentConfig;
        let option = {
            from: connected_addr,
        };
        if (fast) {
            option.gasPrice = await this.#asyncGetFastGasPriceWei(ETHERSCAN_IO_GAS_PRICE_URL);
        }
        const nftContract = new this.lib.eth.Contract(nftContractAbi, nftContractAddress, option);
        return nftContract;
    };

    //330 line

    #asyncGetFastGasPriceWei = async(etherScanGasPriceUrl) => {
        const avgGasPrice = await this.lib.eth.getGasPrice();
        const result = await axios.get(etherScanGasPriceUrl);
        if (result.data.message === "OK") {
            const fastGasPrice = result.data.result.FastGasPrice;
            console.info(`[Web3] fast gas price (gwei) from Etherscan : ${fastGasPrice}`);
            console.info(`[Web3] fast gas price (wei) from Etherscan : ${this.lib.utils.toWei(fastGasPrice.toString(), 'gwei')}`);
    
            if (fastGasPrice > 100) {
              console.error(`[Web3] Too high gas price`);
              return avgGasPrice;
            }
    
            return this.lib.utils.toWei(fastGasPrice.toString(), 'gwei');
        } 
        return avgGasPrice;
    };
};

export default RequestWeb3;
