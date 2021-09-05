import {types} from 'mobx-state-tree';

const Staking = types.model('Staking', {
    id: types.identifierNumber,
    address: types.optional(types.string, ''),
    staking_time: types.maybeNull(types.Date),
    unstaking_time: types.maybeNull(types.Date), 
    staked: types.optional(types.number, 0),
    nft_amount: types.optional(types.number, 0),
    nft_chain_id: types.optional(types.number, -1),
    token_type: types.optional(types.number, 0),
    staking_transaction_hash: types.maybeNull(types.string),
    unstaking_transaction_hash: types.maybeNull(types.string),    
});

export default Staking;
const createStakingNullObject = () => {
  return Staking.create({
    id: -1,
    address: '',
    staking_time: null,
    unstaking_time: null,
    staked: 0,
    nft_amount: 0,
    nft_chain_id: -1,
    token_type: 0,
    staking_transaction_hash: '',
    unstaking_transaction_hash: '',
  }); 
};
export {createStakingNullObject};

/*
CREATE TABLE IF NOT EXISTS `ngfinance_test`.`staking` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(45) NOT NULL,
  `staking_time` DATETIME NOT NULL,
  `unstaking_time` DATETIME NULL DEFAULT NULL,
  `staked` INT NULL DEFAULT '1',
  `nft_amount` INT NOT NULL,
  `nft_chain_id` INT NOT NULL,
  `token_type` INT NOT NULL DEFAULT '0',
  `staking_transaction_hash` VARCHAR(500) NULL DEFAULT NULL,
  `unstaking_transaction_hash` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 222
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
*/