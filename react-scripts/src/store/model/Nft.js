import {types} from 'mobx-state-tree';

const Nft = types.model('Nft', {
  id: types.identifierNumber,
  nft_chain_id: types.optional(types.number, -1),   
  token_type: types.optional(types.number, -1),
  subject: types.optional(types.string, ''),
  description: types.maybeNull(types.string),
  image_url: types.optional(types.string, ''),
  nft_url: types.optional(types.string, ''),  
  contract_type: types.optional(types.number, -1),  
  balance: types.optional(types.number, 0),
}).actions(self => ({
    setBalance(balance) {
      self.balance = balance;
    }
  })
);

export default Nft;

/*
CREATE TABLE IF NOT EXISTS `ngfinance_test`.`nft` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nft_chain_id` INT NOT NULL,
  `token_type` INT NOT NULL DEFAULT '0',
  `subject` VARCHAR(100) NULL DEFAULT NULL,
  `description` VARCHAR(500) NULL DEFAULT NULL,
  `image_url` VARCHAR(500) NULL DEFAULT NULL,
  `nft_url` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
*/