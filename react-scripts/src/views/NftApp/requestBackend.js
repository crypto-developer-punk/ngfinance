import axios from "axios";

export const registerStaking = async(backend_url, my_address, contract_type, nft_chain_id, nft_amount, transactionHash) => {
    const data = {
        "address": my_address,
        "contract_type": contract_type,
        "nft_chain_id": nft_chain_id,
        "nft_amount": nft_amount,
        "staking_transaction_hash": transactionHash
    };

    return axios.post(`${backend_url}/staking/register`, data, {headers: setRequestHeaders(my_address)});
};

export const unstaking = async(backend_url, my_address, contract_type, nft_chain_id) => {
    const data = {
        "address": my_address,
        "contract_type": contract_type,
        "nft_chain_id": nft_chain_id
    };

    return axios.post(`${backend_url}/staking/unstaking`, data, {headers: setRequestHeaders(my_address)});
};

export const getStaked = async(backend_url, my_address, contract_type, nft_chain_id) => {
    const params = {
        "address": my_address,
        "contract_type": contract_type,
        "nft_chain_id": nft_chain_id
    };

    return axios.get(`${backend_url}/staking`, { params : params, headers: setRequestHeaders(my_address) });
};

export const getTotalValueLockedNftAmount = async(backend_url, my_address, token_type) => {
    const params = {
        "token_type": token_type
    };

    return axios.get(`${backend_url}/staking/getTotalValueLockedNftAmount`, { params : params, headers: setRequestHeaders(my_address)});
};

export const snapshotAndRewardToken = async(backend_url, token_type, my_address) => {
    const data = {
        "token_type": token_type
    };

    return axios.post(`${backend_url}/reward/register/allBySnapshot`, data, {headers: setRequestHeaders(my_address)});
};

export const getReward = async(backend_url, my_address, token_type) => {
    const params = {
        "address": my_address,
        "token_type": token_type
    };

    return axios.get(`${backend_url}/reward`, { params : params, headers: setRequestHeaders(my_address) });
};

export const approve = async(backend_url, my_address, token_type) => {
    const data = {
        "address": my_address,
        "token_type": token_type
    };

    return axios.post(`${backend_url}/reward/approve`, data, {headers: setRequestHeaders(my_address)});
};

export const claim = async(backend_url, my_address, token_type, transactionHash) => {
    const data = {
        "address": my_address,
        "token_type": token_type,
        "claimed_transaction_hash": transactionHash
    };

    return axios.post(`${backend_url}/reward/claim`, data, {headers: setRequestHeaders(my_address)});
};

export const rollbackInProgress = async(backend_url, my_address, token_type) => {
    const data = {
        "address": my_address,
        "token_type": token_type
    };

    return axios.post(`${backend_url}/reward/rollbackInProgress`, data, {headers: setRequestHeaders(my_address)});
};

export const getSnapshot = async(backend_url, token_type, my_address) => {
    const params = {
        "token_type": token_type
    };

    return axios.get(`${backend_url}/snapshot/latest`, { params : params , headers: setRequestHeaders(my_address)});
};

export const getNftInfo = async(backend_url, my_address) => {
    return axios.get(`${backend_url}/nft/all`, {headers: setRequestHeaders(my_address)});
};

const setRequestHeaders = (address) => {
    return {"x-ngf-address": address};
};