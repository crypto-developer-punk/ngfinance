import {types} from 'mobx-state-tree';
var moment = require('moment'); // require

const BackendContext = types.model('BackendContext', {
    snapshot_time: types.maybeNull(types.Date), 
    totalValueLockedNftAmount: types.optional(types.number, 0),
    paintRewardTokenAmount: types.optional(types.number, 0)
}).actions(self => ({
    setPaintRewardTokenAmount(tokenAmount) {
      self.paintRewardTokenAmount = tokenAmount;
    }
  })
).views(self => ({
    get snapShotTimeStr() {
      return self.snapshot_time ? 
      moment(self.snapshot_time).format("YYYY-MM-DD hh:mm:ss") : "";
    }
}));

export default BackendContext;
