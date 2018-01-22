INSERT INTO
  flight (squadron_id, name)
VALUES
  (1, 'AWESOME FLIGHT'),
  (2, 'SMELLY FLIGHT'),
  (3, 'TMNT FLIGHT'),
  (3, 'CAPTAIN PLANET FLIGHT');

INSERT INTO
  airman (first_name, last_name, flight_id)
VALUES
  ('FirstName4', 'LastName4', 3),
  ('FirstName5', 'LastName5', 4),
  ('FirstName6', 'LastName6', 5),
  ('FirstName7', 'LastName7', 1),
  ('FirstName8', 'LastName8', 2),
  ('FirstName9', 'LastName9', 2),
  ('FirstName10', 'LastName10', 6);

INSERT INTO
  certification (title)
VALUES
  ('Frost Breath'),
  ('X-Ray Vision'),
  ('Super Strength');

INSERT INTO
  join_airman_certification (airman_id, certification_id, expiration_date)
VALUES
  (4, 1, '2019-01-25'),
  (4, 4, '2019-02-25'),
  (5, 5, '2019-03-25'),
  (5, 6, '2019-04-25'),
  (6, 5, '2019-05-25'),
  (6, 6, '2019-06-25'),
  (7, 3, '2019-07-25'),
  (7, 4, '2019-08-25'),
  (8, 4, '2019-09-25'),
  (8, 5, '2019-10-25'),
  (9, 5, '2019-11-25'),
  (9, 6, '2019-12-25'),
  (10, 6, '2019-12-25');

INSERT INTO
  join_airman_qualification (airman_id, qualification_id, expiration_date)
VALUES
  (4, 1, '2019-01-25'),
  (4, 4, '2019-02-25'),
  (5, 5, '2019-03-25'),
  (5, 6, '2019-04-25'),
  (6, 5, '2019-05-25'),
  (6, 6, '2019-06-25'),
  (7, 3, '2019-07-25'),
  (7, 4, '2019-08-25'),
  (8, 4, '2019-09-25'),
  (8, 5, '2019-10-25'),
  (9, 5, '2019-11-25'),
  (9, 6, '2019-12-25'),
  (10, 6, '2019-12-25');
