-- db 版本
CREATE TABLE version (
    id serial,
    ver int NOT NULL,
    created timestamp DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
