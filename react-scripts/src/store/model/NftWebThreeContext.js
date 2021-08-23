import {types} from 'mobx-state-tree';

const NftWebThreeContext = types.model('NftWebThreeContext', {
  id: types.identifierNumber,
  balance: types.optional(types.string, "0"),    
});

export default NftWebThreeContext;
