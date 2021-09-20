import axios from "axios";
import {environmentConfig} from 'myconfig';
import {isSupportedTokenType} from "myconstants";

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
    
        const {status, data} = await axios.get(`${this.backend_url}/staking`, { params : params, headers: this.#getRequestHeaders(my_address) });
        if (!status === 200)
            throw `asyncGetStaked - ${status} error`;
        if (!data) 
            return {last_staked_time: null, nft_amount: null, in_progress: null};
        const {last_staked_time, nft_amount, in_progress} = data
        return {last_staked_time, nft_amount, in_progress};
    };
    
    asyncGetTotalValueLockedNftAmount = async(my_address, token_type) => {
        if (!isSupportedTokenType(token_type)) 
            throw `token type value : ${token_type}, it is not supported.`;

        const params = {
            "token_type": token_type
        };

        const {status, data} = await axios.get(`${this.backend_url}/staking/getTotalValueLockedNftAmount`, { params : params, headers: this.#getRequestHeaders(my_address)});
        if (!status === 200)
            throw `asyncGetTotalValueLockedNftAmount - ${status} error`;
        const totalValueLockedNftAmount = data && data.length > 0 ? (data[0].totalValueLockedNftAmount || 0) : 0;
        return totalValueLockedNftAmount;
    };
    
    asyncSnapshotAndReward = async(my_address, token_type) => {
        if (!isSupportedTokenType(token_type)) 
            throw `token type value : ${token_type}, it is not supported.`;

        const data = {
            "token_type": token_type
        };
    
        return axios.post(`${this.backend_url}/reward/register/allBySnapshot`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetReward = async(my_address, token_type) => {
        if (!isSupportedTokenType(token_type)) 
            throw `token type value : ${token_type}, it is not supported.`;

        const params = {
            "address": my_address,
            "token_type": token_type
        };
    
        const {status, data} = await axios.get(`${this.backend_url}/reward`, { params : params, headers: this.#getRequestHeaders(my_address) });
        if (!status === 200)
            throw `asyncGetReward - ${status} error`;
        const tokenAmount = data && data.length > 0 ? (data[0].token_amount || 0) : 0;
        return tokenAmount;
    };

    asyncApprove = async(my_address, nft_chain_id, token_type) => {
        if (!isSupportedTokenType(token_type)) 
            throw `token type value : ${token_type}, it is not supported.`;

        const params = {
            "address": my_address,
            "nft_chain_id": nft_chain_id,
            "token_type": token_type
        };
    
        const {status, data} = await axios.post(`${this.backend_url}/reward/approve`, params, {headers: this.#getRequestHeaders(my_address)});
        if (!status === 200)
            throw `asyncApprove - ${status} error`;
        const {approved_token_amount} = data;
        return approved_token_amount;
    };

    asyncClaim = async(my_address, nft_chain_id, token_type, transactionHash) => {
        if (!isSupportedTokenType(token_type)) 
            throw `token type value : ${token_type}, it is not supported.`;

        const data = {
            "address": my_address,
            "token_type": token_type,
            "claimed_transaction_hash": transactionHash
        };
    
        return axios.post(`${this.backend_url}/reward/claim`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetSnapshotTime = async(my_address, token_type) => {
        if (!isSupportedTokenType(token_type)) 
            throw `token type value : ${token_type}, it is not supported.`;

        const params = {
            "token_type": token_type
        };
    
        const {status, data} = await axios.get(`${this.backend_url}/snapshot/latest`, { params : params , headers: this.#getRequestHeaders(my_address)});
        if (status !== 200)
            throw `asyncGetSnapshot - ${status} error`
        const {snapshot_time} = data[0]; 
        return snapshot_time;
    };

    getNftInfo = async(my_address) => {
        return axios.get(`${this.backend_url}/nft/all`, {headers: this.#getRequestHeaders(my_address)});
    };

    #getRequestHeaders = (address) => {
        return {"x-ngf-address": address};
    };
};

export default RequestBackend;
