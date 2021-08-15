import {types} from 'mobx-state-tree';

const Locking = types.model('Locking', {
    id: types.identifierNumber,
    snapshot_id: types.optional(types.number, -1),
    nft_chain_id: types.optional(types.number, -1),   
    status: types.optional(types.string, '')
});

export default Locking;

/*
CREATE TABLE IF NOT EXISTS `ngfinance_test`.`locking` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(45) NOT NULL,
    `nft_chain_id` INT NULL DEFAULT '0',
    `status` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`))
  ENGINE = InnoDB
  AUTO_INCREMENT = 663
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
*/