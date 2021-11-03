import {types} from 'mobx-state-tree';

const OpenSaleNft = types.model('OpenSaleNft', {
  id: types.identifierNumber,
  nft_chain_id: types.optional(types.number, -1),   
  token_type: types.optional(types.number, -1),
  subject: types.optional(types.string, ''),
  description: types.maybeNull(types.string),
  image_url: types.optional(types.string, ''),
  nft_url: types.optional(types.string, ''),  
  contract_type: types.optional(types.number, -1),  
  price: types.optional(types.number, 0),
  price_unit: types.optional(types.number, 0),
  beg_timestamp: types.maybeNull(types.Date),
  end_timestamp: types.maybeNull(types.Date),
  tags: types.array(types.string),
});

export default OpenSaleNft;
