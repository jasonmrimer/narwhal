INSERT INTO flight VALUES (1, 16, 'DOB'), (2, 16, 'DOC');

INSERT INTO airman VALUES
(1, 'Corey', 'Spaceman', 1),
(2, 'Tracy', 'Keeter', 1),
(3, 'Jonathan', 'Graves', 2),
(4, 'Katy', 'Warren', 1),
(5, 'Harold', 'Smidt', 1),
(6, 'Michael', 'McCormmak', 2),
(7, 'Ernesto', 'Rodriguez', 1),
(8, 'Gabriel', 'Zamora', 1),
(9, 'Melissa', 'Parker', 2),
(10, 'Diana', 'Munoz', 1),
(11, 'Sarah', 'Witherall', 1),
(12, 'Evelyne', 'Blakemore', 2),
(13, 'Loraine', 'Freeman', 1),
(14, 'Sharon', 'Smith', 1),
(15, 'Dennis', 'Peterson', 2),
(16, 'Daniel', 'Kaplan', 1),
(17, 'Maria', 'Lopez', 1),
(18, 'Jeanna', 'Piazza', 2),
(19, 'Beth', 'Kolko', 1),
(20, 'Cain', 'Gene', 1),
(21, 'Chapman', 'Charlotte', 2),
(22, 'Barrett', 'Lynda', 1),
(23, 'Patton', 'Angie', 1),
(24, 'Johnson', 'Maurice', 2),
(25, 'Walton', 'Francis', 1),
(26, 'Cook', 'Maureen', 1),
(27, 'Terry', 'Monique', 2),
(28, 'Wolfe', 'Chelsea', 1),
(29, 'Kelly', 'Louise', 2),
(30, 'Vicki', 'Hoffman', 2),
(31, 'Ryan', 'Lamb', 2),
(32, 'Leticia', 'French', 2),
(33, 'Lauren', 'Carr', 2),
(34, 'Woodrow', 'Shaw', 2),
(35, 'Lois', 'Webster', 2),
(36, 'Sean', 'Ryan', 2),
(37, 'Vicky', 'Bowers', 2),
(38, 'Phillip', 'Peters', 2),
(39, 'Josephine', 'Nash', 2);


INSERT INTO certification VALUES
(1, 'Laser Vision'),
(2, 'X-Ray Vision'),
(3, 'Super Speed');


INSERT INTO join_airman_certification
(airman_id, certification_id, earn_date, expiration_date)
VALUES
(1, 1, '2018-01-25', '2019-01-25'),
(1, 3, '2018-01-25', '2019-01-25'),
(2, 1, '2018-01-25', '2019-02-25'),
(2, 2, '2018-01-25', '2019-02-25'),
(3, 2, '2018-01-25', '2019-03-25'),
(3, 3, '2018-01-25', '2019-03-25'),
(4, 1, '2018-01-25', '2019-04-25'),
(4, 3, '2018-01-25', '2019-04-25'),
(5, 1, '2018-01-25', '2019-05-25'),
(5, 2, '2018-01-25', '2019-05-25'),
(6, 2, '2018-01-25', '2019-06-25'),
(6, 3, '2018-01-25', '2019-06-25'),
(7, 1, '2018-01-25', '2019-07-25'),
(7, 3, '2018-01-25', '2019-07-25'),
(8, 1, '2018-01-25', '2019-08-25'),
(8, 2, '2018-01-25', '2019-08-25'),
(9, 2, '2018-01-25', '2019-09-25'),
(9, 3, '2018-01-25', '2019-09-25'),
(10, 1, '2018-01-25', '2019-10-25'),
(10, 3, '2018-01-25', '2019-10-25'),
(11, 1, '2018-01-25', '2019-01-25'),
(11, 2, '2018-01-25', '2019-01-25'),
(12, 2, '2018-01-25', '2019-02-25'),
(12, 3, '2018-01-25', '2019-02-25'),
(13, 1, '2018-01-25', '2019-03-25'),
(13, 3, '2018-01-25', '2019-03-25'),
(14, 1, '2018-01-25', '2019-04-25'),
(14, 2, '2018-01-25', '2019-04-25'),
(15, 1, '2018-01-25', '2019-05-25'),
(15, 3, '2018-01-25', '2019-05-25'),
(16, 1, '2018-01-25', '2019-06-25'),
(16, 2, '2018-01-25', '2019-06-25'),
(17, 2, '2018-01-25', '2019-07-25'),
(17, 3, '2018-01-25', '2019-07-25'),
(18, 1, '2018-01-25', '2019-08-25'),
(18, 3, '2018-01-25', '2019-08-25'),
(19, 1, '2018-01-25', '2019-09-25'),
(19, 2, '2018-01-25', '2019-09-25'),
(20, 2, '2018-01-25', '2019-10-25'),
(20, 3, '2018-01-25', '2019-10-25'),
(21, 1, '2018-01-25', '2019-11-25'),
(22, 2, '2018-01-25', '2019-12-25'),
(23, 3, '2018-01-25', '2019-12-25'),
(24, 1, '2018-01-25', '2019-01-25'),
(25, 2, '2018-01-25', '2019-02-25'),
(26, 3, '2018-01-25', '2019-03-25'),
(27, 1, '2018-01-25', '2019-04-25'),
(28, 2, '2018-01-25', '2019-05-25'),
(29, 2, '2018-01-25', '2019-06-25'),
(30, 3, '2018-01-25', '2019-07-25'),
(31, 1, '2018-01-25', '2019-08-25'),
(32, 2, '2018-01-25', '2019-09-25'),
(33, 3, '2018-01-25', '2019-10-25'),
(34, 1, '2018-01-25', '2019-11-25'),
(35, 2, '2018-01-25', '2019-12-25'),
(36, 2, '2018-01-25', '2019-12-25'),
(37, 3, '2018-01-25', '2019-01-25'),
(38, 1, '2018-01-25', '2019-02-25'),
(39, 2, '2018-01-25', '2019-03-25');

INSERT INTO join_airman_qualification
(airman_id, qualification_id, earn_date, expiration_date)
VALUES
(1, 1, '2019-01-25', '2019-01-25'),
(2, 2, '2019-02-25', '2019-02-25'),
(3, 3, '2019-03-25', '2019-03-25'),
(4, 4, '2019-04-25', '2019-04-25'),
(5, 5, '2019-05-25', '2019-05-25'),
(6, 6, '2019-06-25', '2019-06-25'),
(7, 7, '2019-07-25', '2019-07-25'),
(8, 8, '2019-08-25', '2019-08-25'),
(9, 9, '2019-09-25', '2019-09-25'),
(10, 10, '2019-10-25', '2019-10-25'),
(11, 11, '2019-01-25', '2019-01-25'),
(12, 12, '2019-02-25', '2019-02-25'),
(13, 13, '2019-03-25', '2019-03-25'),
(14, 14, '2019-04-25', '2019-04-25'),
(15, 1, '2019-05-25', '2019-05-25'),
(16, 2, '2019-06-25', '2019-06-25'),
(17, 3, '2019-07-25', '2019-07-25'),
(18, 4, '2019-08-25', '2019-08-25'),
(19, 5, '2019-09-25', '2019-09-25'),
(20, 6, '2019-10-25', '2019-10-25'),
(21, 7, '2019-11-25', '2019-11-25'),
(22, 8, '2019-12-25', '2019-12-25'),
(23, 9, '2019-12-25', '2019-12-25'),
(24, 10, '2019-01-25', '2019-01-25'),
(25, 11, '2019-02-25', '2019-02-25'),
(26, 12, '2019-03-25', '2019-03-25'),
(27, 13, '2019-04-25', '2019-04-25'),
(28, 14, '2019-05-25', '2019-05-25'),
(29, 8, '2019-06-25', '2019-06-25'),
(30, 9, '2019-07-25', '2019-07-25'),
(31, 10, '2019-08-25', '2019-08-25'),
(32, 11, '2019-09-25', '2019-09-25'),
(33, 12, '2019-10-25', '2019-10-25'),
(34, 13, '2019-11-25', '2019-11-25'),
(35, 14, '2019-12-25', '2019-12-25'),
(36, 11, '2019-12-25', '2019-12-25'),
(37, 12, '2019-01-25', '2019-01-25'),
(38, 13, '2019-02-25', '2019-02-25'),
(39, 14, '2019-03-25', '2019-02-25');

INSERT INTO mission VALUES
  (1, 'XXX-FAKE-MISSION-1', NOW(), NOW(), 1),
  (2, 'YYY-FAKE-MISSION-2', NOW(), NOW(), 1),
  (3, 'ZZZ-FAKE-MISSION-3', NOW(), NOW(), 2),
  (4, 'AAA-FAKE-MISSION-4', NOW(), NOW(), 2);

INSERT INTO profile (username, site_id) VALUES
  ('tytus', (SELECT id FROM site WHERE name = 'DMS-MD'));