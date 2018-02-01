ALTER TABLE join_airman_qualification ADD COLUMN earn_date DATE;

ALTER TABLE join_airman_qualification DROP FOREIGN KEY join_airman_qualification_ibfk_1;
ALTER TABLE join_airman_qualification DROP FOREIGN KEY join_airman_qualification_ibfk_2;

ALTER TABLE join_airman_qualification MODIFY qualification_id INT(11) NOT NULL;
DROP INDEX qualification_id ON join_airman_qualification;

ALTER TABLE join_airman_qualification DROP PRIMARY KEY;
ALTER TABLE join_airman_qualification ADD id INT NOT NULL PRIMARY KEY AUTO_INCREMENT;

ALTER TABLE join_airman_qualification ADD CONSTRAINT join_airman_qualification_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id);
ALTER TABLE join_airman_qualification ADD CONSTRAINT join_airman_qualification_ibfk_2 FOREIGN KEY (qualification_id) REFERENCES qualification (id);

ALTER TABLE join_airman_qualification ADD UNIQUE join_airman_qualification_unique_per_airman (airman_id, qualification_id);