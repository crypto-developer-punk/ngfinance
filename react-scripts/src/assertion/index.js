import { ERR_BACKEND_RESPONSE, BACKEND_TIMEOUT_LIMIT_MS, ERR_RESPONSE_TIMEOUT, 
  TRANSACTION_TIMEOUT_LIMIT_MS, ERR_UNSUPPORTED_CONTRACT_TYPE, 
  ERR_WALLET_IS_NOT_CONNECTED, ERR_INVALID_WEB3_NETWORK, 
  TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_PAINT_POOL,
  ERR_UNSUPPORTED_TOKEN_TYPE, ERR_BALANCE_EMPTY
} from "myconstants";
import { ProviderHelper } from 'myutil';

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
};

const assertSupportedTokenType = (token_type) => {
  const token_type_arr = [TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_PAINT_POOL];
  if (!token_type_arr.includes(token_type)) {
      throw {
          code: ERR_UNSUPPORTED_TOKEN_TYPE,
          msg: `${token_type} token type is unsupported</div>`
      }
  }
};

const assertBalanceEmtpy = (balance) => {
  if (balance <= 0) {
    throw {code : ERR_BALANCE_EMPTY, msg: `Balance is empty`}
  }
};

export {
  assertSupportedTokenType,
  assertTransactionTimeoutError,
  assertSupportedContractType,
  assertBackendResponseStatus,
  assertWalletConnect,
  assertNetworkId,
  assertNetworkIdAndWalletConnect,
  assertBalanceEmtpy
}
