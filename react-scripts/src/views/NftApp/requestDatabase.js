import axios from "axios";

export const registerStaking = async(db_host, my_account, nft_chain_id, nft_amount, transactionHash) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id,
        "nft_amount": nft_amount,
        "staking_transaction_hash": transactionHash
    };

    return axios.post(`${db_host}/staking/register`, data);
};

export const unstaking = async(db_host, my_account, nft_chain_id, nft_amount) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id,
        "nft_amount" : nft_amount
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

export const getTotalValueLockedNftAmount = async(db_host) => {
    return axios.get(`${db_host}/staking/getTotalValueLockedNftAmount`);
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

export const getStakeLockStatus = async(db_host, my_account, nft_chain_id) => {
    const params = {
        "address": my_account,
        "nft_chain_id": nft_chain_id
    };

    return axios.get(`${db_host}/lock/stake`, { params : params });
};

export const getClaimLockStatus = async(db_host, my_account) => {
    const params = {
        "address": my_account
    };

    return axios.get(`${db_host}/lock/claim`, { params : params });
};

export const registerReward = async(db_host, my_account) => {
    const data = {
        "address": my_account,
        "snapshot_id": 5,
        "token_type": 0,
        "token_amount": 100,
    };

    return axios.post(`${db_host}/reward/register`, data);
};

export const snapshotAndRewardPaintToken = async(db_host, token_type) => {
    const data = {
        "token_type": token_type
    };

    return axios.post(`${db_host}/reward/register/allBySnapshot`, data);
};

export const getReward = async(db_host, my_account, token_type) => {
    const params = {
        "address": my_account,
        "token_type": token_type
    };

    return axios.get(`${db_host}/reward`, { params : params });
};

export const approve = async(db_host, my_account, nft_chain_id, token_type) => {
    const data = {
        "address": my_account,
        "nft_chain_id": nft_chain_id,
        "token_type": token_type
    };

    return axios.post(`${db_host}/reward/approve`, data);
};

export const claim = async(db_host, my_account, nft_chain_id, token_type, transactionHash) => {
    const data = {
        "address": my_account,
        "token_type": token_type,
        "claimed_transaction_hash": transactionHash
    };

    return axios.post(`${db_host}/reward/claim`, data);
};

export const getSnapshot = async(db_host, token_type) => {
    const params = {
        "token_type": token_type
    };

    return axios.get(`${db_host}/snapshot/latest`, { params : params });
};

export const getNftInfo = async(db_host) => {
    return axios.get(`${db_host}/nft/all`);
};