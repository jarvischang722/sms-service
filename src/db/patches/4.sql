-- 玩家資料
CREATE TABLE player (
  id BIGINT(20) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  merchant_code VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  mobile VARCHAR(50) NOT NULL,
  lucky_draw VARCHAR(8),
  created timestamp DEFAULT CURRENT_TIMESTAMP,
  last_updated timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `mobile_UNIQUE` (`merchant_code`,`mobile`));