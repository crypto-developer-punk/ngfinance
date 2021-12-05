import axios from "axios";
import {environmentConfig} from 'myconfig';
import {
    ERR_LIMIT_LOCKUP_NFT, ERR_UNSKAKING_INPROGRESS, ERR_REWARD_INPROGRESS, BACKEND_TIMEOUT_LIMIT_MS
} from "myconstants";
import {assertSupportedTokenType, assertBackendResponseStatus} from "assertion";

class RequestBackend {
    constructor() {
        this.backend_url = environmentConfig.backend_url;
        this.myaxios = axios.create({
            timeout: BACKEND_TIMEOUT_LIMIT_MS,
        });
    }

    asyncRegisterStaking = async(my_address, contract_type, nft_chain_id, nft_amount_str, token_type, transactionHash) => {
        const data = {
            "address": my_address,
            "contract_type": contract_type,
            "nft_chain_id": nft_chain_id,
            "nft_amount": nft_amount_str,
            "token_type": token_type,
            "staking_transaction_hash": transactionHash,
        };
    
        const res = await this.myaxios.post(`${this.backend_url}/staking/register`, data, {headers: this.#getRequestHeaders(my_address)});
        return res;
    };

    asyncUnstaking = async(my_address, contract_type, nft_chain_id, token_type) => {
        const data = {
            "address": my_address,
            "contract_type": contract_type,
            "nft_chain_id": nft_chain_id,
            "token_type": token_type,
        };
        
        try {
            const res = await this.myaxios.post(`${this.backend_url}/staking/unstaking`, data, {headers: this.#getRequestHeaders(my_address)});
            return res;
        } catch (err) {
            // console.log('asyncUnstaking', err, err.response.data.message, err.msg);
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

    asyncGetStaked = async(my_address, contract_type, nft_chain_id, token_type) => {
        const params = {
            "address": my_address,
            "contract_type": contract_type,
            "nft_chain_id": nft_chain_id,
            "token_type": token_type
        };
        
        // console.log('aaa', `${this.backend_url}/staking`, my_address, contract_type, nft_chain_id);
        const {status, data} = await this.myaxios.get(`${this.backend_url}/staking`, { params, headers: this.#getRequestHeaders(my_address) });
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

        const {status, data} = await this.myaxios.get(`${this.backend_url}/staking/getTotalValueLockedNftAmount`, { params : params, headers: this.#getRequestHeaders(my_address)});
        assertBackendResponseStatus(status);

        const totalValueLockedNftAmount = data && data.length > 0 ? (data[0].totalValueLockedNftAmount || 0) : 0;
        return totalValueLockedNftAmount;
    };
    
    asyncSnapshotAndReward = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const data = {
            "token_type": token_type
        };
    
        const res = await this.myaxios.post(`${this.backend_url}/reward/register/allBySnapshot`, data, {headers: this.#getRequestHeaders(my_address)});
        return res;
    };

    asyncGetReward = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const params = {
            "address": my_address,
            "token_type": token_type
        };
    
        const {status, data} = await this.myaxios.get(`${this.backend_url}/reward`, { params : params, headers: this.#getRequestHeaders(my_address) });
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
        
        try {
            const {status, data} = await this.myaxios.post(`${this.backend_url}/reward/approve`, params, {headers: this.#getRequestHeaders(my_address)});
            assertBackendResponseStatus(status, 'asyncApprove');
    
            const {approved_token_amount} = data;
            return approved_token_amount;
        } catch (err) {
            if (err.response && err.response.data && err.response.data.txId && err.response.data.hash) {
                const {etherscan_url} = environmentConfig;
                const transaction_url = etherscan_url + err.response.data.hash;
                throw {
                    code: ERR_REWARD_INPROGRESS,
                    msg:  
                    <div>
                        Now Nostalgia Finance approving your reward.
                        <br/>Please wait the operation.
                        <br/><br/>Please check approving reward transaction on Etherscan.
                        <br/><br/><a href={transaction_url} target={"_blank"}>View your transaction on Etherscan</a>    
                    </div>                
                }
            }

            throw err
        }
    };

    asyncClaim = async(my_address, nft_chain_id, token_type, transactionHash) => {
        assertSupportedTokenType(token_type);

        const data = {
            "address": my_address,
            "token_type": token_type,
            "claimed_transaction_hash": transactionHash
        };
    
        return this.myaxios.post(`${this.backend_url}/reward/claim`, data, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetSnapshotTime = async(my_address, token_type) => {
        assertSupportedTokenType(token_type);

        const params = {
            "token_type": token_type
        };
    
        const {status, data} = await this.myaxios.get(`${this.backend_url}/snapshot/latest`, { params : params , headers: this.#getRequestHeaders(my_address)});
        assertBackendResponseStatus(status, 'asyncGetSnapshotTime');
        
        if (!data || data.length < 1) {
            return null;
        }

        const {snapshot_time} = data[0]; 
        return snapshot_time;
    };

    getNftInfo = async(my_address) => {
        return this.myaxios.get(`${this.backend_url}/nft/all`, {headers: this.#getRequestHeaders(my_address)});
    };

    asyncGetRewardInfoAll = async(my_address) => {
        const {status, data} = await this.myaxios.get(`${this.backend_url}/reward/info/all`, {headers: this.#getRequestHeaders(my_address)});
        console.log('aaa', data);
        assertBackendResponseStatus(status, 'asyncGetRewardInfoAll');
        return {nft_paint_apw: data["NFT_PAINT"], paint_eth_apw: data["PAINT-ETH"], nft_canvas_apw: data["NFT_CANVAS"], paint_singple_apw: data["PAINT-SINGLE"]};
    };
    
    // private methods

    #getRequestHeaders = (address) => {
        return {"x-ngf-address": address};
    };
};

export default RequestBackend;
