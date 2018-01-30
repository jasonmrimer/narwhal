CREATE TABLE site (
  id INT (11) NOT NULL AUTO_INCREMENT,
  name VARCHAR (64) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_site_name (name)
);

CREATE TABLE squadron (
  id INT (11) NOT NULL AUTO_INCREMENT,
  name VARCHAR (64) NOT NULL,
  site_id INT (11) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY site_id (site_id),
  CONSTRAINT squadron_ibfk_1 FOREIGN KEY (site_id) REFERENCES site (id)
);

CREATE TABLE flight (
  id INT (11) NOT NULL AUTO_INCREMENT,
  squadron_id INT (11) NOT NULL,
  name VARCHAR (64) NOT NULL,
  PRIMARY KEY (id),
  KEY squadron_id (squadron_id),
  CONSTRAINT flight_ibfk_1 FOREIGN KEY (squadron_id) REFERENCES squadron (id)
);

CREATE TABLE airman (
  id INT (11) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (64) NOT NULL,
  last_name VARCHAR (64) NOT NULL,
  flight_id INT (11) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY flight_id (flight_id),
  CONSTRAINT airman_ibfk_2 FOREIGN KEY (flight_id) REFERENCES flight (id)
);

CREATE TABLE event (
  id INT (11) NOT NULL AUTO_INCREMENT,
  title VARCHAR (64) NOT NULL,
  description VARCHAR (64) DEFAULT NULL,
  start_time datetime DEFAULT NULL,
  end_time datetime DEFAULT NULL,
  airman_id INT (11) DEFAULT NULL,
  type VARCHAR (65) NOT NULL DEFAULT 'MISSION',
  PRIMARY KEY (id),
  KEY airman_id (airman_id),
  CONSTRAINT event_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id)
);

CREATE TABLE certification (
  id INT (11) NOT NULL AUTO_INCREMENT,
  title VARCHAR (64) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE join_airman_certification (
  airman_id INT (11) NOT NULL,
  certification_id INT (11) NOT NULL,
  expiration_date date DEFAULT NULL,
  PRIMARY KEY (airman_id, certification_id),
  KEY certification_id (certification_id),
  CONSTRAINT join_airman_certification_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id),
  CONSTRAINT join_airman_certification_ibfk_2 FOREIGN KEY (certification_id) REFERENCES certification (id)
);

CREATE TABLE qualification (
  id INT (11) NOT NULL AUTO_INCREMENT,
  acronym VARCHAR (64) NOT NULL,
  title VARCHAR (64) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE join_airman_qualification (
  airman_id INT (11) NOT NULL,
  qualification_id INT (11) NOT NULL AUTO_INCREMENT,
  expiration_date date DEFAULT NULL,
  PRIMARY KEY (airman_id, qualification_id),
  KEY qualification_id (qualification_id),
  CONSTRAINT join_airman_qualification_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id),
  CONSTRAINT join_airman_qualification_ibfk_2 FOREIGN KEY (qualification_id) REFERENCES qualification (id)
);

CREATE TABLE mission (
  mission_id VARCHAR (64) NOT NULL,
  ato_mission_number VARCHAR (64) DEFAULT NULL,
  start_date_time datetime DEFAULT NULL,
  end_date_time datetime DEFAULT NULL,
  site_id INT (11) DEFAULT NULL,
  PRIMARY KEY (mission_id),
  KEY site_id (site_id),
  CONSTRAINT mission_ibfk_1 FOREIGN KEY (site_id) REFERENCES site (id)
);

INSERT INTO site VALUES
  (1, 'DGS-1'),
  (2, 'DGS-2'),
  (3, 'DGS-3'),
  (4, 'DGS-4'),
  (5, 'DGS-5'),
  (6, '480'),
  (7, 'DGS-AR'),
  (8, 'DGS-AL'),
  (9, 'DGS-IN'),
  (10, 'DGS-KS'),
  (11, 'DGS-MA'),
  (12, 'DGS-NV'),
  (13, 'DMS-GA'),
  (15, 'DMS-GE'),
  (16, 'DMS-HI'),
  (14, 'DMS-MD'),
  (17, 'DMS-TX'),
  (18, 'DMS-UT');

INSERT INTO squadron VALUES
  (1, '30 IS', 1),
  (2, '45 IS', 1),
  (3, '13 IS', 2),
  (4, '9 IS', 2),
  (5, '6 IS', 3),
  (6, '24 IS', 4),
  (7, '8 IS', 5),
  (8, '480 IS', 6),
  (9, '123 IS', 7),
  (10, '117 IS', 8),
  (11, '137 IS', 9),
  (12, '161 IS', 10),
  (13, '101 IS', 11),
  (14, '152 IS', 12),
  (15, '3 IS', 13),
  (16, '94 IS', 14),
  (17, '402 IS', 15),
  (18, '324 IS', 16),
  (19, '531 IS', 17),
  (20, '169 IS', 18),
  (21, '303 IS', 3);

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