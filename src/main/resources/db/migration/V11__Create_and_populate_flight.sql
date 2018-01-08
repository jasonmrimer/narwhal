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
  (1, 1, 'SUPER FLIGHT'),
  (2, 2, 'LAME FLIGHT');

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

ALTER TABLE airman drop FOREIGN KEY `airman_ibfk_1`;
ALTER TABLE airman drop COLUMN unit_id;