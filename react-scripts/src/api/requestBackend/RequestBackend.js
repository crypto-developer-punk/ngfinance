import axios from "axios";
import {environmentConfig} from 'myconfig';
import {
    assertSupportedTokenType, ERR_LIMIT_LOCKUP_NFT, ERR_UNSKAKING_INPROGRESS, ERR_BACKEND_RESPONSE, 
    assertBackendResponseStatus
} from "myconstants";

class RequestBackend {
    constructor() {
        this.backend_url = environmentConfig.backend_url;
    }

    asyncRegisterStaking = async(my_address, contract_type, nft_chain_id, nft_amount, transactionHash) => {
        const data = {
            "address": my_address,
            "contract_type": contract_type,
            "nft_chain_id": nft_chain_id,
            "nft_amount": nft_amount,
            "staking_transaction_hash": transactionHash
        };
    
        const res = await axios.post(`${this.backend_url}/staking/register`, data, {headers: this.#getRequestHeaders(my_address)});
        return res;
    };

    asyncUnstaking = async(my_address, contract_type, nft_chain_id) => {
        const data = {
            "address": my_address,
            "contract_type": contract_type,
            "nft_chain_id": nft_chain_id
        };
        
        try {
            const res = await axios.post(`${this.backend_url}/staking/unstaking`, data, {headers: this.#getRequestHeaders(my_address)});
            return res;
        } catch (err) {
            console.log('asyncUnstaking', err, err.response.data.message, err.msg);
            if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes("already unstaking is in progress")) {
                throw {
                    code: ERR_UNSKAKING_INPROGRESS, 
                    msg:            
                    <div>
                        Server unstaking is in progress.
                    </div>
                }
            }
            if (err.response && err.response.data && err.response.data.message && err.response.data.dayOfLockUpNft) {
                throw {
                    code: ERR_LIMIT_LOCKUP_NFT, 
                    msg:            
                    <div>
                        Unstaking is possible {err.response.data.dayOfLockUpNft} days after staking.
                        <br/>
                        <br/>
                        Remaining time: {err.response.data.message}  
                    </div>,
                    payload: {dayOfLockUpNft: err.response.data.dayOfLockUpNft, remainingTime: err.response.data.message}
                }
            } 
            throw err;
        }
    };

    asyncGetStaked = async(my_address, contract_type, nft_chain_id) => {
        const params = {
            "address": my_address,
            "contract_type": contract_type,
            "nft_chain_id": nft_chain_id
        };
        
        // console.log('aaa', `${this.backend_url}/staking`, my_address, contract_type, nft_chain_id);
        const {status, data} = await axios.get(`${this.backend_url}/staking`, { params, headers: this.#getRequestHeaders(my_address) });
        assertBackendResponseStatus(status, 'asyncGetStaked');

        if (!data) 
            return {last_staked_time: null, token_amount: null, in_progress: null};
        const {last_staked_time, nft_amount, in_progress} = data
        return {last_staked_time, token_amount: nft_amount, in_progress};
    };
    
    asyncGetTotalValueLockedNftAmount = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const params = {
            "token_type": token_type
        };

        const {status, data} = await axios.get(`${this.backend_url}/staking/getTotalValueLockedNftAmount`, { params : params, headers: this.#getRequestHeaders(my_address)});
        assertBackendResponseStatus(status);

        const totalValueLockedNftAmount = data && data.length > 0 ? (data[0].totalValueLockedNftAmount || 0) : 0;
        return totalValueLockedNftAmount;
    };
    
    asyncSnapshotAndReward = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const data = {
            "token_type": token_type
        };
    
        const res = await axios.post(`${this.backend_url}/reward/register/allBySnapshot`, data, {headers: this.#getRequestHeaders(my_address)});
        return res;
    };

    asyncGetReward = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const params = {
            "address": my_address,
            "token_type": token_type
        };
    
        const {status, data} = await axios.get(`${this.backend_url}/reward`, { params : params, headers: this.#getRequestHeaders(my_address) });
        assertBackendResponseStatus(status, 'asyncGetReward');

        const tokenAmount = data && data.length > 0 ? (data[0].token_amount || 0) : 0;
        return tokenAmount;
    };

    asyncApprove = async(my_address, nft_chain_id, token_type) => {
        assertSupportedTokenType(token_type);

        const params = {
            "address": my_address,
            "nft_chain_id": nft_chain_id,
            "token_type": token_type
        };
    
        const {status, data} = await axios.post(`${this.backend_url}/reward/approve`, params, {headers: this.#getRequestHeaders(my_address)});
        assertBackendResponseStatus(status, 'asyncApprove');

        const {approved_token_amount} = data;
        return approved_token_amount;
    };

    asyncClaim = async(my_address, nft_chain_id, token_type, transactionHash) => {
        assertSupportedTokenType(token_type);

        const data = {
            "address": my_address,
            "token_type": token_type,
            "claimed_transaction_hash": transactionHash
        };
    
        return axios.post(`${this.backend_url}/reward/claim`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetSnapshotTime = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const params = {
            "token_type": token_type
        };
    
        const {status, data} = await axios.get(`${this.backend_url}/snapshot/latest`, { params : params , headers: this.#getRequestHeaders(my_address)});
        assertBackendResponseStatus(status, 'asyncGetSnapshotTime');

        const {snapshot_time} = data[0]; 
        return snapshot_time;
    };

    getNftInfo = async(my_address) => {
        return axios.get(`${this.backend_url}/nft/all`, {headers: this.#getRequestHeaders(my_address)});
    };

    // private methods

    #getRequestHeaders = (address) => {
        return {"x-ngf-address": address};
    };
};

export default RequestBackend;
