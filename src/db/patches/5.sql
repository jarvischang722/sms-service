
CREATE TABLE `winning` (
  `id` BIGINT(20) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `merchant_code` VARCHAR(255) NOT NULL COMMENT '商號',
  `period` VARCHAR(12) NOT NULL COMMENT '期數',
  `lucky_draw` VARCHAR(8) NOT NULL COMMENT '開獎號碼',
  `winner_mobile` VARCHAR(50) COMMENT '中獎人手機號',
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `merch_period_UNIQUE` (`merchant_code`,`period`));




