ALTER TABLE join_airman_qualification CHANGE COLUMN `expiration_date` periodic_due VARCHAR(64);

ALTER TABLE join_airman_qualification ADD COLUMN last_sat DATE DEFAULT NULL;
ALTER TABLE join_airman_qualification ADD COLUMN currency_expiration DATE DEFAULT NULL;

UPDATE join_airman_qualification SET last_sat = CURDATE();
UPDATE join_airman_qualification SET currency_expiration = CURDATE();

ALTER TABLE join_airman_certification CHANGE COLUMN `expiration_date` periodic_due VARCHAR(64);

ALTER TABLE join_airman_certification ADD COLUMN last_sat DATE DEFAULT NULL;
ALTER TABLE join_airman_certification ADD COLUMN currency_expiration DATE DEFAULT NULL;

UPDATE join_airman_certification SET last_sat = CURDATE();
UPDATE join_airman_certification SET currency_expiration = CURDATE();