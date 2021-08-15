import {types} from 'mobx-state-tree';

const Snapshot = types.model('Staking', {
    id: types.identifierNumber,
    snapshot_time: types.Date,
    token_type: types.optional(types.number, -1),
    token_amount: types.optional(types.number, 0)
});

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