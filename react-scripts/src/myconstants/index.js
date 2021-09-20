const TOKEN_TYPE_PAINT_NFT = 0;
const TOKEN_TYPE_CANVAS_PAINT_ETH_LP = 1;
const TOKEN_TYPE_CANVAS_NFT = 2;
const TOKEN_ID_PAINT_ETH_LP = -1;

const isSupportedTokenType = (token_type) => {
    const token_type_arr = [TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_CANVAS_NFT];
    return token_type_arr.includes(token_type);
};

export {TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_CANVAS_NFT, TOKEN_ID_PAINT_ETH_LP, isSupportedTokenType};