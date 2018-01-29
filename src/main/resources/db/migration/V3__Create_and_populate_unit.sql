CREATE TABLE unit (
  id   INT         NOT NULL,
  name VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO unit (id, name)
VALUES
  (1, '30 IS'),
  (2, '45 IS'),
  (3, '13 IS'),
  (4, '9 IS'),
  (5, '6303 IS'),
  (6, '24 IS'),
  (7, '8 IS'),
  (8, '480 IS'),
  (9, '123 IS'),
  (10, '117 IS'),
  (11, '137 IS'),
  (12, '161 IS'),
  (13, '101 IS'),
  (14, '152 IS'),
  (15, '3 IS'),
  (16, '94 IS'),
  (17, '402 IS'),
  (18, '324 IS'),
  (19, '531 IS'),
  (20, '169 IS');

ALTER TABLE airman
  ADD COLUMN unit_id INT,
  ADD FOREIGN KEY (unit_id) REFERENCES unit (id);

UPDATE airman
SET unit_id = 16
WHERE id = 1;

UPDATE airman
SET unit_id = 16
WHERE id = 2;

UPDATE airman
SET unit_id = 16
WHERE id = 3;

UPDATE airman
SET unit_id = 16
WHERE id = 4;

UPDATE airman
SET unit_id = 16
WHERE id = 5;

UPDATE airman
SET unit_id = 16
WHERE id = 6;

UPDATE airman
SET unit_id = 16
WHERE id = 7;

UPDATE airman
SET unit_id = 16
WHERE id = 8;

UPDATE airman
SET unit_id = 16
WHERE id = 9;

UPDATE airman
SET unit_id = 16
WHERE id = 10;

UPDATE airman
SET unit_id = 16
WHERE id = 11;


UPDATE airman
SET unit_id = 16
WHERE id = 12;


UPDATE airman
SET unit_id = 16
WHERE id = 13;

UPDATE airman
SET unit_id = 16
WHERE id = 14;


UPDATE airman
SET unit_id = 16
WHERE id = 15;

UPDATE airman
SET unit_id = 16
WHERE id = 16;

UPDATE airman
SET unit_id = 16
WHERE id = 17;

UPDATE airman
SET unit_id = 16
WHERE id = 18;

UPDATE airman
SET unit_id = 16
WHERE id = 19;

UPDATE airman
SET unit_id = 16
WHERE id = 20;

UPDATE airman
SET unit_id = 16
WHERE id = 21;

UPDATE airman
SET unit_id = 16
WHERE id = 22;

UPDATE airman
SET unit_id = 16
WHERE id = 23;

UPDATE airman
SET unit_id = 16
WHERE id = 24;

UPDATE airman
SET unit_id = 16
WHERE id = 25;

UPDATE airman
SET unit_id = 16
WHERE id = 26;

UPDATE airman
SET unit_id = 16
WHERE id = 27;

UPDATE airman
SET unit_id = 16
WHERE id = 28;

UPDATE airman
SET unit_id = 16
WHERE id = 29;

UPDATE airman
SET unit_id = 16
WHERE id = 30;

UPDATE airman
SET unit_id = 16
WHERE id = 31;

UPDATE airman
SET unit_id = 16
WHERE id = 32;

UPDATE airman
SET unit_id = 16
WHERE id = 33;

UPDATE airman
SET unit_id = 16
WHERE id = 34;

UPDATE airman
SET unit_id = 16
WHERE id = 35;

UPDATE airman
SET unit_id = 16
WHERE id = 36;

UPDATE airman
SET unit_id = 16
WHERE id = 37;

UPDATE airman
SET unit_id = 16
WHERE id = 38;

UPDATE airman
SET unit_id = 16
WHERE id = 39;