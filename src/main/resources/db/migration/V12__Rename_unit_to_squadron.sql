ALTER TABLE flight drop FOREIGN KEY `flight_ibfk_1`;

RENAME TABLE unit TO squadron;

ALTER TABLE `flight` CHANGE COLUMN `unit_id` `squadron_id` INT NOT NULL;
ALTER TABLE flight ADD FOREIGN KEY (squadron_id) REFERENCES squadron (id);
