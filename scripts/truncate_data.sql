SET FOREIGN_KEY_CHECKS=0;

TRUNCATE TABLE flight;
TRUNCATE TABLE profile;
TRUNCATE TABLE join_airman_qualification;
TRUNCATE TABLE join_airman_certification;
TRUNCATE TABLE join_airman_rip_item;
TRUNCATE TABLE join_airman_schedule;
TRUNCATE TABLE join_mission_airman;
TRUNCATE TABLE certification;
TRUNCATE TABLE qualification;
TRUNCATE TABLE mission;
TRUNCATE TABLE airman;

SET FOREIGN_KEY_CHECKS=1;