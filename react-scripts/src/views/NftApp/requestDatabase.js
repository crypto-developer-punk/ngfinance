import axios from "axios";

export const registerStaking = async(db_host, my_account, nft_chain_id, nft_amount) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id,
        "nft_amount": nft_amount
    };

    return axios.post(`${db_host}/staking/register`, data);
};

export const unstaking = async(db_host, my_account, nft_chain_id) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id
    };

    return axios.post(`${db_host}/staking/unstaking`, data);
};

export const getStaked = async(db_host, my_account, nft_chain_id) => {
    const params = {
        "address": my_account,
        "nft_chain_id": nft_chain_id
    };

    return axios.get(`${db_host}/staking`, { params : params });
};

export const registerLock = async(db_host, my_account, nft_chain_id, status) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id,
        "status": status
    };

    return axios.post(`${db_host}/lock/register`, data);
};

export const unlock = async(db_host, my_account, nft_chain_id, status) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id,
        "status": status
    };

    return axios.post(`${db_host}/lock/unlock`, data);
};

export const getLockStatus = async(db_host, my_account, nft_chain_id) => {
    const params = {
        "address": my_account,
        "nft_chain_id": nft_chain_id
    };

    return axios.get(`${db_host}/lock`, { params : params });
};