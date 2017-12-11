CREATE TABLE qualification (
  id      INT         NOT NULL,
  acronym VARCHAR(64) NOT NULL,
  title   VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO
  qualification (id, acronym, title)
VALUES
  (1, 'MMS', 'My Mission Supervisor'),
  (2, 'MSA', 'Multi Source Analyst'),
  (3, 'MOC', 'Mission Operations Commander'),
  (4, 'IMS', 'Imagery Mission Supervisor'),
  (5, 'GRE', 'Geospatial Reports Editor'),
  (6, 'SCR', 'Screener'),
  (7, 'GA', 'Geospatial Analyst'),
  (8, 'GMS', 'Ground Mission Supervisor'),
  (9, 'SSO', 'Special Signals Operator'),
  (10, 'CMS', 'Cryptologic Mission Supervisor'),
  (11, 'CO(Lang)', 'Cryptologic Operator with Language'),
  (12, 'CO', 'Cryptologic Operator W/O Language'),
  (13, 'I', 'Instructor'),
  (14, 'E', 'Evaluator');

CREATE TABLE join_airman_qualification (
  airman_id        INT NOT NULL,
  qualification_id INT NOT NULL,

  FOREIGN KEY (airman_id) REFERENCES airman (id),
  FOREIGN KEY (qualification_id) REFERENCES qualification (id),

  PRIMARY KEY (airman_id, qualification_id)
);

INSERT INTO
  join_airman_qualification (airman_id, qualification_id)
VALUES
  (1, 1),
  (1, 13),
  (1, 14),
  (2, 2),
  (2, 5),
  (3, 4);
