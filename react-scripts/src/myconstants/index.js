const TOKEN_TYPE_PAINT_NFT = 0;
const TOKEN_TYPE_CANVAS_PAINT_ETH_LP = 1;
const TOKEN_TYPE_CANVAS_NFT = 2;
const CHAIN_ID_PAINT_ETH_LP_TOKEN = -1;
const CONTRACT_TYPE_PAINT_ETH_LP_TOKEN = 1155;

const assertSupportedTokenType = (token_type) => {
    const token_type_arr = [TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_CANVAS_NFT];
    if (!token_type_arr.includes(token_type)) {
        throw {
            code: ERR_UNSUPPORTED_TOKEN_TYPE,
            msg: `${token_type} token type is unsupported</div>`
        }
    }
};

const TIMEOUT_LIMIT_MS = 1000 * 60 * 2;

const assertTimeoutError = (elapsedms) => {
    if (!elapsedms)
        return;

    if (elapsedms > TIMEOUT_LIMIT_MS) {
        throw {
            code: ERR_RESPONSE_TIMEOUT,
            msg: `Response time is over ${(TIMEOUT_LIMIT_MS / (1000 * 60))} minute.`
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

export {
    TOKEN_TYPE_PAINT_NFT, 
    TOKEN_TYPE_CANVAS_PAINT_ETH_LP, 
    TOKEN_TYPE_CANVAS_NFT, 
    CHAIN_ID_PAINT_ETH_LP_TOKEN, 
    CONTRACT_TYPE_PAINT_ETH_LP_TOKEN,
    assertSupportedTokenType,
    assertTimeoutError,
    assertSupportedContractType,
    assertBackendResponseStatus
};

const ERR_WALLET_IS_NOT_CONNECTED = 'ERR_WALLET_IS_NOT_CONNECTED';
const ERR_LIMIT_LOCKUP_NFT = 'ERR_LIMIT_LOCKUP_NFT';
const ERR_UNSKAKING_INPROGRESS = 'ERR_UNSKAKING_INPROGRESS';
const ERR_UNSUPPORTED_TOKEN_TYPE = 'ERR_UNSUPPORTED_TOKEN_TYPE';
const ERR_UNSUPPORTED_CONTRACT_TYPE = 'ERR_UNSUPPORTED_CONTRACT_TYPE';
const ERR_BACKEND_RESPONSE = 'ERR_BACKEND_RESPONSE';
const ERR_RESPONSE_TIMEOUT = 'ERR_RESPONSE_TIMEOUT';

export {
    ERR_WALLET_IS_NOT_CONNECTED,
    ERR_LIMIT_LOCKUP_NFT,
    ERR_UNSKAKING_INPROGRESS,

    ERR_UNSUPPORTED_TOKEN_TYPE,
    ERR_UNSUPPORTED_CONTRACT_TYPE,
    ERR_BACKEND_RESPONSE,

    ERR_RESPONSE_TIMEOUT
};