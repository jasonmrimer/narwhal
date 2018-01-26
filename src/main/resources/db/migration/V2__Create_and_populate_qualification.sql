CREATE TABLE qualification (
  id      INT         NOT NULL,
  acronym VARCHAR(64) NOT NULL,
  title   VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO
  qualification (id, acronym, title)
VALUES
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

CREATE TABLE join_airman_qualification (
  airman_id        INT NOT NULL,
  qualification_id INT NOT NULL,
  expiration_date DATE,

  FOREIGN KEY (airman_id) REFERENCES airman (id),
  FOREIGN KEY (qualification_id) REFERENCES qualification (id),

  PRIMARY KEY (airman_id, qualification_id)
);

INSERT INTO
  join_airman_qualification (airman_id, qualification_id, expiration_date)
VALUES
  (1, 1, '2019-01-25'),
  (2, 2, '2019-02-25'),
  (3, 3, '2019-03-25'),
  (4, 4, '2019-04-25'),
  (5, 5, '2019-05-25'),
  (6, 6, '2019-06-25'),
  (7, 7, '2019-07-25'),
  (8, 8, '2019-08-25'),
  (9, 9, '2019-09-25'),
  (10, 10, '2019-10-25'),
  (11, 11, '2019-01-25'),
  (12, 12, '2019-02-25'),
  (13, 13, '2019-03-25'),
  (14, 14, '2019-04-25'),
  (15, 1, '2019-05-25'),
  (16, 2, '2019-06-25'),
  (17, 3, '2019-07-25'),
  (18, 4, '2019-08-25'),
  (19, 5, '2019-09-25'),
  (20, 6, '2019-10-25'),
  (21, 7, '2019-11-25'),
  (22, 8, '2019-12-25'),
  (23, 9, '2019-12-25'),
  (24, 10, '2019-01-25'),
  (25, 11, '2019-02-25'),
  (26, 12, '2019-03-25'),
  (27, 13, '2019-04-25'),
  (28, 14, '2019-05-25'),
  (29, 8, '2019-06-25'),
  (30, 9, '2019-07-25'),
  (31, 10, '2019-08-25'),
  (32, 11, '2019-09-25'),
  (33, 12, '2019-10-25'),
  (34, 13, '2019-11-25'),
  (35, 14, '2019-12-25'),
  (36, 11, '2019-12-25'),
  (37, 12, '2019-01-25'),
  (38, 13, '2019-02-25'),
  (39, 14, '2019-03-25');