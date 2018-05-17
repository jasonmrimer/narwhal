SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE flight;
TRUNCATE TABLE profile;
TRUNCATE TABLE join_airman_qualification;
TRUNCATE TABLE join_airman_certification;
TRUNCATE TABLE join_airman_rip_item;
TRUNCATE TABLE join_mission_airman;
TRUNCATE TABLE certification;
TRUNCATE TABLE qualification;
TRUNCATE TABLE mission;
TRUNCATE TABLE airman;
TRUNCATE TABLE squadron;
TRUNCATE TABLE site;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO site VALUES (1, 'DGS-1', 'DGSCoreSite', 'DGS 1');

INSERT INTO squadron VALUES
  (1, '10 IS', 1),
  (2, '30 IS', 1),
  (3, '45 IS', 1),
  (4, '497 OSS', 1);

DROP PROCEDURE IF EXISTS createFlights;
CREATE PROCEDURE createFlights()
  BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= 4 DO
      INSERT INTO flight (squadron_id, name) VALUES
        (i, 'DOA'),
        (i, 'DOB'),
        (i, 'DOC'),
        (i, 'DOD'),
        (i, 'DOE'),
        (i, 'DOF');
      SET i = i + 1;
    END WHILE;
  END;

CALL createFlights();

INSERT INTO qualification VALUES
  (1, 'QB', 'My Mission Supervisor'),
  (2, 'WR', 'Multi Source Analyst'),
  (3, 'RB', 'Mission Operations Commander'),
  (4, 'CB', 'Imagery Mission Supervisor'),
  (5, 'HB', 'Geospatial Reports Editor'),
  (6, 'FB', 'Screener'),
  (7, 'C', 'Geospatial Analyst'),
  (8, 'TE', 'Ground Mission Supervisor'),
  (9, 'K', 'Special Signals Operator'),
  (10, 'SP', 'Cryptologic Mission Supervisor'),
  (11, 'WB', 'Cryptologic Operator with Language'),
  (12, 'JK', 'Cryptologic Operator W/O Language'),
  (13, 'HT', 'Instructor'),
  (14, 'XW', 'Evaluator');

INSERT INTO certification VALUES
  (1, 'LASER VISION', 1),
  (2, 'X-RAY VISION', 1),
  (3, 'Super Speed', 1),
  (4, 'Invisibility', 1);

DROP PROCEDURE IF EXISTS populateFlights;
CREATE PROCEDURE populateFlights()
  BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;

    WHILE i <= 24 DO
      WHILE j <= 60 DO
        INSERT INTO airman (first_name, last_name, flight_id, shift) VALUES
          (CONCAT('FirstName', i * j), CONCAT('LastName', i * j), i, 'Day');
        SET j = j + 1;
      END WHILE;
      SET j = 1;
      SET i = i + 1;
    END WHILE;
  END;

CALL populateFlights();

DROP PROCEDURE IF EXISTS airmanCerts;
CREATE PROCEDURE airmanCerts()
  BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= 1440 DO
      INSERT INTO join_airman_certification
      (airman_id, certification_id, earn_date, expiration_date)
      VALUES
        (i, 1, '2018-01-25', '2019-01-25'),
        (i, 3, '2018-01-25', '2019-01-25');
      SET i = i + 1;
    END WHILE;
  END;

CALL airmanCerts();

DROP PROCEDURE IF EXISTS airmanQuals;
CREATE PROCEDURE airmanQuals()
  BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= 1440 DO
      INSERT INTO join_airman_qualification
      (airman_id, qualification_id, earn_date, expiration_date)
      VALUES
        (i, 1, '2018-01-25', '2019-01-25'),
        (i, 3, '2018-01-25', '2019-01-25');
      SET i = i + 1;
    END WHILE;
  END;

CALL airmanQuals();

INSERT INTO join_airman_rip_item (airman_id, rip_item_id)
  SELECT
    a.id,
    ri.id
  FROM airman a
    JOIN rip_item ri
      ON 1 = 1;

DROP PROCEDURE IF EXISTS airmanEvents;
CREATE PROCEDURE airmanEvents()
  BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;

    WHILE i <= 1440 DO
      WHILE j <= 30 DO

        INSERT INTO event (title, description, start_time, end_time, airman_id, type) VALUES
          (
            CONCAT('Title', i * j),
            CONCAT('Descr', i * j),
            DATE(DATE_ADD(DATE_ADD(CURDATE(), INTERVAL(1-DAYOFWEEK(CURDATE())) DAY), INTERVAL j DAY)),
            DATE(DATE_ADD(DATE_ADD(CURDATE(), INTERVAL(1-DAYOFWEEK(CURDATE())) DAY), INTERVAL j DAY)),
            i,
            'LEAVE'
          );
        SET j = j + 1;
      END WHILE;
      SET j = 1;
      SET i = i + 1;
    END WHILE;
  END;

CALL airmanEvents();

INSERT INTO profile (username, site_id) VALUES
  ('tytus', (SELECT id
             FROM site
             WHERE name = 'DGS-1'));
