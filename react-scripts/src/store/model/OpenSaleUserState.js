import {types} from 'mobx-state-tree';
import {IDLE_OPEN_SALE, JOINED_OPEN_SALE, TRY_JOIN_OPEN_SALE, PURCHASED_OPEN_SALE} from 'myconstants';

const OpenSaleUserState = types.model('OpenSaleUserState', {
  accountAddress: types.identifier,
  state: types.enumeration(IDLE_OPEN_SALE, [IDLE_OPEN_SALE, JOINED_OPEN_SALE, TRY_JOIN_OPEN_SALE, PURCHASED_OPEN_SALE]),
  contractType: types.optional(types.string, ""),
  nftChainId: types.optional(types.string, ""),
  ttl: types.optional(types.number, 0),
});

export default OpenSaleUserState;
