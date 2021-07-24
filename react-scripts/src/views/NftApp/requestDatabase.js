import axios from "axios";

export const registerStaking = async(db_host, my_address, nft_chain_id, nft_amount, transactionHash) => {
    const data = {
        "address": my_address,
        "nft_chain_id": nft_chain_id,
        "nft_amount": nft_amount,
        "staking_transaction_hash": transactionHash
    };

    return axios.post(`${db_host}/staking/register`, data, {headers: setRequestHeaders(my_address)});
};

export const unstaking = async(db_host, my_address, nft_chain_id) => {
    const data = {
        "address": my_address,
        "nft_chain_id": nft_chain_id
    };

    return axios.post(`${db_host}/staking/unstaking`, data, {headers: setRequestHeaders(my_address)});
};

export const getStaked = async(db_host, my_address, nft_chain_id) => {
    const params = {
        "address": my_address,
        "nft_chain_id": nft_chain_id
    };

    return axios.get(`${db_host}/staking`, { params : params, headers: setRequestHeaders(my_address) });
};

export const getTotalValueLockedNftAmount = async(db_host, my_address) => {
    return axios.get(`${db_host}/staking/getTotalValueLockedNftAmount`, {headers: setRequestHeaders(my_address)});
};

export const snapshotAndRewardPaintToken = async(db_host, token_type, my_address) => {
    const data = {
        "token_type": token_type
    };

    return axios.post(`${db_host}/reward/register/allBySnapshot`, data, {headers: setRequestHeaders(my_address)});
};

export const getReward = async(db_host, my_address, token_type) => {
    const params = {
        "address": my_address,
        "token_type": token_type
    };

    return axios.get(`${db_host}/reward`, { params : params, headers: setRequestHeaders(my_address) });
};

export const approve = async(db_host, my_address, nft_chain_id, token_type) => {
    const data = {
        "address": my_address,
        "nft_chain_id": nft_chain_id,
        "token_type": token_type
    };

    return axios.post(`${db_host}/reward/approve`, data, {headers: setRequestHeaders(my_address)});
};

export const claim = async(db_host, my_address, nft_chain_id, token_type, transactionHash) => {
    const data = {
        "address": my_address,
        "token_type": token_type,
        "claimed_transaction_hash": transactionHash
    };

    return axios.post(`${db_host}/reward/claim`, data, {headers: setRequestHeaders(my_address)});
};

export const getSnapshot = async(db_host, token_type, my_address) => {
    const params = {
        "token_type": token_type
    };

    return axios.get(`${db_host}/snapshot/latest`, { params : params , headers: setRequestHeaders(my_address)});
};

export const getNftInfo = async(db_host, my_address) => {
    return axios.get(`${db_host}/nft/all`, {headers: setRequestHeaders(my_address)});
};

const setRequestHeaders = (address) => {
    return {"x-ngf-address": address};
};