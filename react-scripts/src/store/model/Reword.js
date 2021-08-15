import {types} from 'mobx-state-tree';

const Reward = types.model('Reward', {
    id: types.identifierNumber,
    snapshot_id: types.optional(types.number, -1),
    address: types.optional(types.string, ''),
    token_type: types.optional(types.number, -1),
    token_amount: types.optional(types.number, 0),
    claimed: types.optional(types.number, 0),
    claimed_time: types.Date,
    approved: types.optional(types.number, 0),
    approved_transaction_hash: types.optional(types.string, ''),
    claimed_transaction_hash: types.optional(types.string, ''),
});

export default Reward;

/*
CREATE TABLE IF NOT EXISTS `ngfinance_test`.`reward` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `snapshot_id` INT NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `token_type` INT NOT NULL,
  `token_amount` INT NOT NULL,
  `claimed` INT NULL DEFAULT '0',
  `claimed_time` DATETIME NULL DEFAULT NULL,
  `approved` INT NULL DEFAULT '0',
  `approved_transaction_hash` VARCHAR(500) NULL DEFAULT NULL,
  `claimed_transaction_hash` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 955
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
*/