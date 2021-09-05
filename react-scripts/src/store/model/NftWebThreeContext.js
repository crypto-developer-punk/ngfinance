import {types} from 'mobx-state-tree';

const NftWebThreeContext = types.model('NftWebThreeContext', {
  id: types.identifierNumber,
  balance: types.optional(types.string, "0"),    
}).actions(self => ({
    setBalance(balance) {
      self.balance = balance;
    }
  })
);

export default NftWebThreeContext;
