import {types} from 'mobx-state-tree';
var moment = require('moment'); // require

const Snapshot = types.model('Snapshot', {
    snapshot_time: types.maybeNull(types.Date),
    total_value_locked_nft_amount: types.optional(types.number, 0),
    balance_of_reward: types.optional(types.number, 0)
})
.actions(self => ({
  setBalanceOfReward(reward) {
    self.balance_of_reward = reward;
  }
}))
.views(self => ({
  get snapShotTimeStr() {
    return self.snapshot_time ? 
    moment(self.snapshot_time).format("YYYY-MM-DD hh:mm:ss") : "";
  }
}));;

export default Snapshot;

/*
CREATE TABLE IF NOT EXISTS `ngfinance_test`.`snapshot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `snapshot_time` DATETIME NOT NULL,
  `token_type` INT NOT NULL,
  `token_amount` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 30
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
*/