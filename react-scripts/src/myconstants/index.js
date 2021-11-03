import {ProviderHelper} from 'myutil';

const TOKEN_TYPE_PAINT_NFT = 0;
const TOKEN_TYPE_CANVAS_PAINT_ETH_LP = 1;
const TOKEN_TYPE_CANVAS_NFT = 2;
const CHAIN_ID_PAINT_ETH_LP_TOKEN = -1;

const assertSupportedTokenType = (token_type) => {
    const token_type_arr = [TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_CANVAS_NFT];
    if (!token_type_arr.includes(token_type)) {
        throw {
            code: ERR_UNSUPPORTED_TOKEN_TYPE,
            msg: `${token_type} token type is unsupported</div>`
        }
    }
};

const WEBTHREE_TIMEOUT_LIMIT_MS = 1000 * 60;
const BACKEND_TIMEOUT_LIMIT_MS = 1000 * 60 * 2;
const TRANSACTION_TIMEOUT_LIMIT_MS = 1000 * 60 * 2;

const assertTransactionTimeoutError = (elapsedms) => {
    if (!elapsedms)
        return;

    if (elapsedms > BACKEND_TIMEOUT_LIMIT_MS) {
        throw {
            code: ERR_RESPONSE_TIMEOUT,
            msg: `Response time is over ${(TRANSACTION_TIMEOUT_LIMIT_MS / (1000 * 60))} minute.`
        }
    }
};

const assertSupportedContractType = (contract_type) => {
    if (contract_type === 721 || contract_type === 1155) {
        return;
    }

    throw {
        code: ERR_UNSUPPORTED_CONTRACT_TYPE,
        msg: `${contract_type} contract type is unsupported`
    }
};

const assertBackendResponseStatus = (status, option_occured_place) => {
    if (status >= 200 && status <= 206) {
        return;
    }

    throw {
        code: ERR_BACKEND_RESPONSE,
        msg: `{status} error occured` + option_occured_place ? ` in ${option_occured_place}` : ''
    }
};

const assertWalletConnect = (isWalletConnected) => {
    if (isWalletConnected) {
        return;
    }

    throw {code: ERR_WALLET_IS_NOT_CONNECTED, msg: 'Wallet is not connected.'};
};

const assertNetworkId = (networkId) => {
    if (networkId === 1 || networkId === 4) {
        return;
    }

    throw {code: ERR_INVALID_WEB3_NETWORK, msg: `Invalid network ${ProviderHelper.getNetworkName(networkId)}. Change to mainet.`};
};

const assertNetworkIdAndWalletConnect = (networkId, isWalletConnected) => {
    assertNetworkId(networkId);
    assertWalletConnect(isWalletConnected);
}

export {
    TOKEN_TYPE_PAINT_NFT, 
    TOKEN_TYPE_CANVAS_PAINT_ETH_LP, 
    TOKEN_TYPE_CANVAS_NFT, 
    CHAIN_ID_PAINT_ETH_LP_TOKEN, 
    BACKEND_TIMEOUT_LIMIT_MS,
    WEBTHREE_TIMEOUT_LIMIT_MS,
    assertSupportedTokenType,
    assertTransactionTimeoutError,
    assertSupportedContractType,
    assertBackendResponseStatus,
    assertWalletConnect,
    assertNetworkId,
    assertNetworkIdAndWalletConnect
};

const ERR_WALLET_IS_NOT_CONNECTED = 'ERR_WALLET_IS_NOT_CONNECTED';
const ERR_LIMIT_LOCKUP_NFT = 'ERR_LIMIT_LOCKUP_NFT';
const ERR_UNSKAKING_INPROGRESS = 'ERR_UNSKAKING_INPROGRESS';
const ERR_UNSUPPORTED_TOKEN_TYPE = 'ERR_UNSUPPORTED_TOKEN_TYPE';
const ERR_UNSUPPORTED_CONTRACT_TYPE = 'ERR_UNSUPPORTED_CONTRACT_TYPE';
const ERR_BACKEND_RESPONSE = 'ERR_BACKEND_RESPONSE';
const ERR_RESPONSE_TIMEOUT = 'ERR_RESPONSE_TIMEOUT';
const ERR_INVALID_WEB3_NETWORK = 'ERR_INVALID_WEB3_NETWORK';
const ERR_REWARD_INPROGRESS = 'ERR_REWARD_INPROGRESS';
const ERR_REJECT_TRANSACTION = 4001

export {
    ERR_WALLET_IS_NOT_CONNECTED,
    ERR_LIMIT_LOCKUP_NFT,
    ERR_UNSKAKING_INPROGRESS,
    ERR_REWARD_INPROGRESS,

    ERR_UNSUPPORTED_TOKEN_TYPE,
    ERR_UNSUPPORTED_CONTRACT_TYPE,
    ERR_BACKEND_RESPONSE,

    ERR_RESPONSE_TIMEOUT,
    ERR_INVALID_WEB3_NETWORK,
    ERR_REJECT_TRANSACTION
};

const IDLE_OPEN_SALE = 'IDLE_OPEN_SALE';
const TRY_JOIN_OPEN_SALE = 'TRY_JOIN_OPEN_SALE';
const JOINED_OPEN_SALE = 'JOINED_OPEN_SALE';
const PURCHASED_OPEN_SALE = 'PURCHASED_OPEN_SALE';

export {
    IDLE_OPEN_SALE,
    TRY_JOIN_OPEN_SALE,
    JOINED_OPEN_SALE,
    PURCHASED_OPEN_SALE
};

const CONTRACT_TYPE_1155 = 1155;
const CONTRACT_TYPE_721 = 721;

export {
    CONTRACT_TYPE_1155,
    CONTRACT_TYPE_721
}