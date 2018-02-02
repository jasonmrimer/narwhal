ALTER TABLE join_airman_certification ADD COLUMN earn_date DATE;

ALTER TABLE join_airman_certification DROP FOREIGN KEY join_airman_certification_ibfk_1;
ALTER TABLE join_airman_certification DROP FOREIGN KEY join_airman_certification_ibfk_2;

ALTER TABLE join_airman_certification MODIFY certification_id INT(11) NOT NULL;
DROP INDEX certification_id ON join_airman_certification;

ALTER TABLE join_airman_certification DROP PRIMARY KEY;
ALTER TABLE join_airman_certification ADD id INT NOT NULL PRIMARY KEY AUTO_INCREMENT;

ALTER TABLE join_airman_certification ADD CONSTRAINT join_airman_certification_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id);
ALTER TABLE join_airman_certification ADD CONSTRAINT join_airman_certification_ibfk_2 FOREIGN KEY (certification_id) REFERENCES certification (id);

ALTER TABLE join_airman_certification ADD UNIQUE join_airman_certification_unique_per_airman (airman_id, certification_id);