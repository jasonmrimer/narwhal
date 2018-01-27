CREATE TABLE site (
  id   INT         NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT unique_site_name UNIQUE (name)
);

INSERT INTO site (id, name)
VALUES
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
  (14, 'DMS-MD'),
  (15, 'DMS-GE'),
  (16, 'DMS-HI'),
  (17, 'DMS-TX'),
  (18, 'DMS-UT');

ALTER TABLE mission
  ADD COLUMN site_id INT,
  ADD FOREIGN KEY (site_id) REFERENCES site (id);

ALTER TABLE squadron
  ADD COLUMN site_id INT;
ALTER TABLE squadron
  ADD FOREIGN KEY (site_id) REFERENCES site (id);

UPDATE squadron
SET site_id = 1
WHERE id IN (1, 2);

UPDATE squadron
SET site_id = 2
WHERE id IN (3, 4);

UPDATE squadron
SET name = '6 IS'
WHERE id = 5;

INSERT INTO squadron (id, site_id, name)
VALUES (21, 3, '303 IS');

UPDATE squadron
SET site_id = 3
WHERE id IN (5);

UPDATE squadron
SET site_id = 4
WHERE id IN (6);

UPDATE squadron
SET site_id = 5
WHERE id IN (7);

UPDATE squadron
SET site_id = 6
WHERE id IN (8);

UPDATE squadron
SET site_id = 7
WHERE id IN (9);

UPDATE squadron
SET site_id = 8
WHERE id IN (10);

UPDATE squadron
SET site_id = 9
WHERE id IN (11);

UPDATE squadron
SET site_id = 10
WHERE id IN (12);

UPDATE squadron
SET site_id = 11
WHERE id IN (13);

UPDATE squadron
SET site_id = 12
WHERE id IN (14);

UPDATE squadron
SET site_id = 13
WHERE id IN (15);

UPDATE squadron
SET site_id = 14
WHERE id IN (16);

UPDATE squadron
SET site_id = 15
WHERE id IN (17);

UPDATE squadron
SET site_id = 16
WHERE id IN (18);

UPDATE squadron
SET site_id = 17
WHERE id IN (19);

UPDATE squadron
SET site_id = 18
WHERE id IN (20);