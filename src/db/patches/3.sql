-- 手機驗證碼暫時存放
CREATE TABLE verification_code_mapping (
  id BIGINT(20) PRIMARY KEY AUTO_INCREMENT  NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  verification_code VARCHAR(100) NOT NULL,
  created timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX mobile_UNIQUE (mobile ASC));