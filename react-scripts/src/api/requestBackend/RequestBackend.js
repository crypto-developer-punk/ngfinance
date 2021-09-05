import axios from "axios";
import {environmentConfig} from 'myconfig';

class RequestBackend {
    constructor() {
        this.backend_url = environmentConfig.backend_url;
    }

    asyncRegisterStaking = async(my_address, nft_chain_id, nft_amount, transactionHash) => {
        const data = {
            "address": my_address,
            "nft_chain_id": nft_chain_id,
            "nft_amount": nft_amount,
            "staking_transaction_hash": transactionHash
        };
    
        return axios.post(`${this.backend_url}/staking/register`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncUnstaking = async(my_address, nft_chain_id) => {
        const data = {
            "address": my_address,
            "nft_chain_id": nft_chain_id
        };
    
        return axios.post(`${this.backend_url}/staking/unstaking`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetStaked = async(my_address, nft_chain_id) => {
        const params = {
            "address": my_address,
            "nft_chain_id": nft_chain_id
        };
    
        return axios.get(`${this.backend_url}/staking`, { params : params, headers: this.#getRequestHeaders(my_address) });
    };
    
    asyncGetTotalValueLockedNftAmount = async(my_address, token_type) => {
        return axios.get(`${this.backend_url}/staking/getTotalValueLockedNftAmount?token_type=${token_type}`, {headers: this.#getRequestHeaders(my_address)});
    };
    
    asyncSnapshotAndRewardPaintToken = async(my_address, token_type) => {
        const data = {
            "token_type": token_type
        };
    
        return axios.post(`${this.backend_url}/reward/register/allBySnapshot`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetReward = async(my_address, token_type) => {
        const params = {
            "address": my_address,
            "token_type": token_type
        };
    
        return axios.get(`${this.backend_url}/reward`, { params : params, headers: this.#getRequestHeaders(my_address) });
    };

    asyncApprove = async(my_address, nft_chain_id, token_type) => {
        const data = {
            "address": my_address,
            "nft_chain_id": nft_chain_id,
            "token_type": token_type
        };
    
        return axios.post(`${this.backend_url}/reward/approve`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncClaim = async(my_address, nft_chain_id, token_type, transactionHash) => {
        const data = {
            "address": my_address,
            "token_type": token_type,
            "claimed_transaction_hash": transactionHash
        };
    
        return axios.post(`${this.backend_url}/reward/claim`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetSnapshot = async(my_address, token_type) => {
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
