import axios from "axios";
import {timeout, ProviderHelper} from 'myutil';
import Config, {environmentConfig} from 'myconfig';
import {TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP} from 'myconstants';

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

    asyncGetEthBalance = async(connected_addr) => {
        const balance = this.lib.utils.fromWei(await this.lib.eth.getBalance(connected_addr), 'ether');
        return parseFloat(balance);
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

    asyncClaimToken = async(connected_addr, token_type, approved_token_amount, transactionHashCB) => {
        const {PAINT_TOKEN_CONTRACT_ABI, PAINT_TOKEN_CONTRACT_ADDRESS, 
            CANVAS_TOKEN_CONTRACT_ABI, CANVAS_TOKEN_CONTRACT_ADDRESS, 
            toStakingAddress, ETHERSCAN_IO_GAS_PRICE_URL} = environmentConfig;
        
        let contractAbi = null;
        let contractAddress = null;
        switch (token_type) {
            case TOKEN_TYPE_PAINT_NFT:
                contractAbi = PAINT_TOKEN_CONTRACT_ABI;
                contractAddress = PAINT_TOKEN_CONTRACT_ADDRESS;
            break;
            case TOKEN_TYPE_CANVAS_PAINT_ETH_LP:
                contractAbi = CANVAS_TOKEN_CONTRACT_ABI;
                contractAddress = CANVAS_TOKEN_CONTRACT_ADDRESS;
            break;
            case TOKEN_TYPE_CANVAS_NFT:
                contractAbi = CANVAS_TOKEN_CONTRACT_ABI;
                contractAddress = CANVAS_TOKEN_CONTRACT_ADDRESS;
            break;
        }

        if (!contractAbi || !contractAddress) {
            throw `${token_type} token type is not supported`;
        }

        let contract = new this.lib.eth.Contract(contractAbi, contractAddress, {
            from: connected_addr
          });
        let tokenAmount = await contract.methods.allowance(toStakingAddress, connected_addr).call();
        console.log("requestTransferFromPaintToken > allowance token amount: " + tokenAmount);
        console.log("requestTransferFromPaintToken > approved token amount: " + approved_token_amount);
        contract = new this.lib.eth.Contract(contractAbi, contractAddress, {
            from: connected_addr, // default from address
            gasPrice: await this.#asyncGetFastGasPriceWei(ETHERSCAN_IO_GAS_PRICE_URL)
          });
          
        const receipt = contract.methods.transferFrom(toStakingAddress, connected_addr, this.lib.utils.toWei(approved_token_amount.toString(), 'ether')).send()
          .on('transactionHash', function(hash){
            if (transactionHashCB) transactionHashCB(hash);
          });
        return receipt;
    };

    asyncGetBalanceOfNft = async(contract_type, nft_chain_id, connected_addr) => {
        const nftContract = await this.#asyncGetNftContract(connected_addr, contract_type, false);
        // console.log('aaa 3', nftContract);
        let balanceOfNft;
        if (contract_type === 721) {
            balanceOfNft = await nftContract.methods.balanceOf(connected_addr).call();
        } else if (contract_type === 1155){
            balanceOfNft = await nftContract.methods.balanceOf(connected_addr, nft_chain_id).call();
        } else {
            throw 'unsurported contract_type';
        }
        // TODO aaa
        console.log(`aaa nft_chain_id: ${nft_chain_id}, contract_type: ${contract_type}, balanceOfNft: ${balanceOfNft}`);
        return parseFloat(balanceOfNft);
    };

    asyncRegisterNftStaking = async(fromAddress, contract_type, nft_chain_id, amountOfNft, transactionHashCB) => {
        const {toStakingAddress} = environmentConfig;
        if (contract_type === 721) {
            return await this.asyncSafeTransferFrom721(fromAddress, toStakingAddress, nft_chain_id, (hash)=>{
                if (transactionHashCB) transactionHashCB(hash);
            });
        } else if (contract_type === 1155){
            return await this.asyncSafeTransferFrom1155(fromAddress, toStakingAddress, nft_chain_id, amountOfNft, (hash)=>{
                if (transactionHashCB) transactionHashCB(hash);
            });
        }
    };

    asyncMockRegisterNftStaking = async(fromAddress, nft_chain_id, amountOfNft, transactionHashCB) => {
        setTimeout(()=>{
            transactionHashCB("0xd6293f6d012b93c2efd9c65df48606a3022d6d51db159b7a36fc6c7981310892");
        }, 2000);
        return {};
    };

    asyncSafeTransferFrom721 = async(connected_addr, toAddress, nft_chain_id, transactionHashCB) => {
        const nftContract = await this.#asyncGetNftContract(connected_addr, 721, true);        
        const receipt = await nftContract.methods.safeTransferFrom(connected_addr, toAddress, nft_chain_id, "0x00").send()
            .on('transactionHash', (hash)=>{
                if (transactionHashCB) transactionHashCB(hash);                
            });
        return receipt;
    };    

    // https://web3js.readthedocs.io/en/v1.2.2/web3-eth-contract.html#methods-mymethod-send
    asyncSafeTransferFrom1155 = async(connected_addr, toAddress, nft_chain_id, amountOfNft, transactionHashCB) => {
        // console.log('aaa 4', connected_addr, toAddress, nft_chain_id, amountOfNft, transactionHashCB);
        const nftContract = await this.#asyncGetNftContract(connected_addr, 1155, true);
        // console.log('aaa 2', nftContract.methods);
        const receipt = await nftContract.methods.safeTransferFrom(connected_addr, toAddress, nft_chain_id, amountOfNft, "0x00").send()
            .on('transactionHash', (hash)=>{
                if (transactionHashCB) transactionHashCB(hash);                
            });
        // console.log('aaa 5', receipt);
        return receipt;
    };
    
    asyncGetBalanceOfPaintEthLP = async(connected_addr) => {
        const paintEthLpContract = await this.#asyncGetPaintEthLpContract(connected_addr);
        const balanceWei = await paintEthLpContract.methods.balanceOf(connected_addr).call();
        const balanceEther = await this.lib.utils.fromWei(balanceWei, 'ether');
        console.log("Check balance of PAINT-ETH LP: " + balanceEther);
        return parseFloat(balanceEther);
    };

    asyncRegisterPaintEthLpStaking = async(connected_addr, amount, transactionHashCB) => {
        const {toStakingAddress} = environmentConfig;
        
        const paintEthLpContract = await this.#asyncGetPaintEthLpContract(connected_addr, true);
        let amountStr = typeof amount === 'number' ? amount.toString() : amount;
        const balanceWei = await this.lib.utils.toWei(amountStr, 'ether');

        // console.log("balanceWei", balanceWei);
        const receipt = await paintEthLpContract.methods.transfer(toStakingAddress, balanceWei).send()
            .on('transactionHash', (hash)=>{
                if (transactionHashCB) transactionHashCB(hash);
            });
        return receipt;
    };

    // privates methods

    #asyncGetNftContract = async(connected_addr, contract_type, fast) => {
        const {ETHERSCAN_IO_GAS_PRICE_URL, NFT_CONTRACT_ERC_1155_ABI, NFT_CONTRACT_ERC_1155_ADDRESS, NFT_CONTRACT_ERC_721_ABI, NFT_CONTRACT_ERC_721_ADDRESS} = environmentConfig;
        let option = {
            from: connected_addr,
        };
        if (fast) {
            option.gasPrice = await this.#asyncGetFastGasPriceWei(ETHERSCAN_IO_GAS_PRICE_URL);
        }
        if (contract_type === 721) {
            return new this.lib.eth.Contract(NFT_CONTRACT_ERC_721_ABI, NFT_CONTRACT_ERC_721_ADDRESS, option);
        } else if (contract_type === 1155){
            return new this.lib.eth.Contract(NFT_CONTRACT_ERC_1155_ABI, NFT_CONTRACT_ERC_1155_ADDRESS, option);
        } else {
            throw 'unsurported contract_type'
        }
    };

    #asyncGetPaintEthLpContract = async(connected_addr, fast) => {
        const {PAINT_ETH_LP_CONTRACT_ABI, PAINT_ETH_LP_CONTRACT_ADDRESS, ETHERSCAN_IO_GAS_PRICE_URL} = environmentConfig;
        let option = {
            from: connected_addr,
        };
        if (fast) {
            option.gasPrice = await this.#asyncGetFastGasPriceWei(ETHERSCAN_IO_GAS_PRICE_URL);
        }
        const paintEthLpContract = new this.lib.eth.Contract(PAINT_ETH_LP_CONTRACT_ABI, PAINT_ETH_LP_CONTRACT_ADDRESS, option);
        return paintEthLpContract;
    };

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
