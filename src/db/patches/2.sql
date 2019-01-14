-- 商戶資料
CREATE TABLE merchant (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT  NOT NULL,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(255) NOT NULL,
  sign_key VARCHAR(255) NOT NULL,
  created timestamp DEFAULT CURRENT_TIMESTAMP,
  last_updated timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX code_UNIQUE (code ASC));



  INSERT INTO `merchant` (`name`, `code`, `sign_key`)
  VALUES ('tripleonetech','tripleonetech', 'd8295889bc23439a9605dbc78a47fb1c');