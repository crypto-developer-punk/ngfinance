import axios from "axios";
import {environmentConfig} from 'myconfig';

class RequestBackend {
    constructor() {
        this.backend_url = environmentConfig.backend_url;
    }

    registerStaking = async(my_address, nft_chain_id, nft_amount, transactionHash) => {
        const data = {
            "address": my_address,
            "nft_chain_id": nft_chain_id,
            "nft_amount": nft_amount,
            "staking_transaction_hash": transactionHash
        };
    
        return axios.post(`${this.backend_url}/staking/register`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    unstaking = async(my_address, nft_chain_id) => {
        const data = {
            "address": my_address,
            "nft_chain_id": nft_chain_id
        };
    
        return axios.post(`${this.backend_url}/staking/unstaking`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    getStaked = async(my_address, nft_chain_id) => {
        const params = {
            "address": my_address,
            "nft_chain_id": nft_chain_id
        };
    
        return axios.get(`${this.backend_url}/staking`, { params : params, headers: this.#getRequestHeaders(my_address) });
    };
    
    getTotalValueLockedNftAmount = async(my_address) => {
        return axios.get(`${this.backend_url}/staking/getTotalValueLockedNftAmount`, {headers: this.#getRequestHeaders(my_address)});
    };
    
    snapshotAndRewardPaintToken = async(token_type, my_address) => {
        const data = {
            "token_type": token_type
        };
    
        return axios.post(`${this.backend_url}/reward/register/allBySnapshot`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    getReward = async(my_address, token_type) => {
        const params = {
            "address": my_address,
            "token_type": token_type
        };
    
        return axios.get(`${this.backend_url}/reward`, { params : params, headers: this.#getRequestHeaders(my_address) });
    };

    approve = async(my_address, nft_chain_id, token_type) => {
        const data = {
            "address": my_address,
            "nft_chain_id": nft_chain_id,
            "token_type": token_type
        };
    
        return axios.post(`${this.backend_url}/reward/approve`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    claim = async(my_address, nft_chain_id, token_type, transactionHash) => {
        const data = {
            "address": my_address,
            "token_type": token_type,
            "claimed_transaction_hash": transactionHash
        };
    
        return axios.post(`${this.backend_url}/reward/claim`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    getSnapshot = async(token_type, my_address) => {
        const params = {
            "token_type": token_type
        };
    
        return axios.get(`${this.backend_url}/snapshot/latest`, { params : params , headers: this.#getRequestHeaders(my_address)});
    };

    getNftInfo = async(my_address) => {
        return axios.get(`${this.backend_url}/nft/all`, {headers: this.#getRequestHeaders(my_address)});
    };

    #getRequestHeaders = (address) => {
        return {"x-ngf-address": address};
    };
};

export default RequestBackend;
