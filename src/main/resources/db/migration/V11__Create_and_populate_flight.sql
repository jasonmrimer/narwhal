CREATE TABLE flight (
  id   INT         NOT NULL AUTO_INCREMENT,
  unit_id INT,
  name VARCHAR(64) NOT NULL,
  FOREIGN KEY (unit_id) REFERENCES unit (id),
  PRIMARY KEY (id)
);

INSERT INTO
  flight (id, unit_id, name)
VALUES
  (1, 16, 'DOB'),
  (2, 16, 'DOC');

ALTER TABLE airman
  ADD COLUMN flight_id INT,
  ADD FOREIGN KEY (flight_id) REFERENCES flight (id);

UPDATE airman
SET flight_id = 1
WHERE id = 1;

UPDATE airman
SET flight_id = 1
WHERE id = 2;

UPDATE airman
SET flight_id = 2
WHERE id = 3;

UPDATE airman
SET flight_id = 1
WHERE id = 4;

UPDATE airman
SET flight_id = 1
WHERE id = 5;

UPDATE airman
SET flight_id = 2
WHERE id = 6;

UPDATE airman
SET flight_id = 1
WHERE id = 7;

UPDATE airman
SET flight_id = 1
WHERE id = 8;

UPDATE airman
SET flight_id = 2
WHERE id = 9;

UPDATE airman
SET flight_id = 1
WHERE id = 10;

UPDATE airman
SET flight_id = 1
WHERE id = 11;

UPDATE airman
SET flight_id = 2
WHERE id = 12;

UPDATE airman
SET flight_id = 1
WHERE id = 13;

UPDATE airman
SET flight_id = 1
WHERE id = 14;

UPDATE airman
SET flight_id = 2
WHERE id = 15;

UPDATE airman
SET flight_id = 1
WHERE id = 16;

UPDATE airman
SET flight_id = 1
WHERE id = 17;

UPDATE airman
SET flight_id = 2
WHERE id = 18;

UPDATE airman
SET flight_id = 1
WHERE id = 19;

UPDATE airman
SET flight_id = 1
WHERE id = 20;

UPDATE airman
SET flight_id = 2
WHERE id = 21;

UPDATE airman
SET flight_id = 1
WHERE id = 22;

UPDATE airman
SET flight_id = 1
WHERE id = 23;

UPDATE airman
SET flight_id = 2
WHERE id = 24;

UPDATE airman
SET flight_id = 1
WHERE id = 25;

UPDATE airman
SET flight_id = 1
WHERE id = 26;

UPDATE airman
SET flight_id = 2
WHERE id = 27;

UPDATE airman
SET flight_id = 1
WHERE id = 28;

UPDATE airman
SET flight_id = 2
WHERE id = 29;

UPDATE airman
SET flight_id = 2
WHERE id = 30;

UPDATE airman
SET flight_id = 2
WHERE id = 31;

UPDATE airman
SET flight_id = 2
WHERE id = 32;

UPDATE airman
SET flight_id = 2
WHERE id = 33;

UPDATE airman
SET flight_id = 2
WHERE id = 34;

UPDATE airman
SET flight_id = 2
WHERE id = 35;

UPDATE airman
SET flight_id = 2
WHERE id = 36;

UPDATE airman
SET flight_id = 2
WHERE id = 37;

UPDATE airman
SET flight_id = 2
WHERE id = 38;

UPDATE airman
SET flight_id = 2
WHERE id = 39;

ALTER TABLE airman drop FOREIGN KEY `airman_ibfk_1`;
ALTER TABLE airman drop COLUMN unit_id;