ALTER TABLE crew DROP FOREIGN KEY join_crew_ibfk_1;
ALTER TABLE crew DROP KEY mission_id;

ALTER TABLE mission ADD id INT(11);
ALTER TABLE mission DROP PRIMARY KEY;
ALTER TABLE mission MODIFY COLUMN id INT(11) AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE join_crew_airman ADD COLUMN mission_id INT(11);

UPDATE join_crew_airman AS A INNER JOIN
  (select C.id as `crewId`, M.id as `msnId` from crew as C join mission as M on C.mission_id = M.mission_id) as X
    ON A.crew_id = crewId
SET A.mission_id = msnId;

ALTER TABLE join_crew_airman MODIFY mission_id INT(11) NOT NULL;

ALTER TABLE join_crew_airman DROP FOREIGN KEY join_crew_airman_ibfk_2;

ALTER TABLE join_crew_airman DROP KEY unique_crew_airman;

ALTER TABLE join_crew_airman DROP COLUMN crew_id;

ALTER TABLE join_crew_airman DROP FOREIGN KEY join_crew_airman_ibfk_1;

RENAME TABLE
    join_crew_airman TO join_mission_airman;

ALTER TABLE join_mission_airman ADD CONSTRAINT join_mission_airman_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id);

DROP TABLE crew;

ALTER TABLE join_mission_airman ADD CONSTRAINT join_mission_airman_ibfk_2 FOREIGN KEY (mission_id) REFERENCES mission (id);

ALTER TABLE join_mission_airman ADD UNIQUE unique_mission_airman (mission_id, airman_id);
