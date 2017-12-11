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
SET unit_id = 1
WHERE id = 1;

UPDATE airman
SET unit_id = 1
WHERE id = 2;

UPDATE airman
SET unit_id = 2
WHERE id = 3;