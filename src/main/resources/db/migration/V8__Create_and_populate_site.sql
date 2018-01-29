CREATE TABLE site (
  id   INT         NOT NULL,
  name VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
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
