ALTER TABLE squadron ADD COLUMN  site_id INT;
ALTER TABLE squadron ADD FOREIGN KEY (site_id) REFERENCES site (id);

UPDATE squadron
SET site_id = 1
WHERE id in (1, 2);

UPDATE squadron
SET site_id = 2
WHERE id in (3, 4);

UPDATE squadron
SET name = '6 IS'
WHERE id = 5;

INSERT INTO squadron (id, site_id, name)
VALUES (21, 3, '303 IS');

UPDATE squadron
SET site_id = 3
WHERE id in (5);

UPDATE squadron
SET site_id = 4
WHERE id in (6);

UPDATE squadron
SET site_id = 5
WHERE id in (7);

UPDATE squadron
SET site_id = 6
WHERE id in (8);

UPDATE squadron
SET site_id = 7
WHERE id in (9);

UPDATE squadron
SET site_id = 8
WHERE id in (10);

UPDATE squadron
SET site_id = 9
WHERE id in (11);

UPDATE squadron
SET site_id = 10
WHERE id in (12);

UPDATE squadron
SET site_id = 11
WHERE id in (13);

UPDATE squadron
SET site_id = 12
WHERE id in (14);

UPDATE squadron
SET site_id = 13
WHERE id in (15);

UPDATE squadron
SET site_id = 14
WHERE id in (16);

UPDATE squadron
SET site_id = 15
WHERE id in (17);

UPDATE squadron
SET site_id = 16
WHERE id in (18);

UPDATE squadron
SET site_id = 17
WHERE id in (19);

UPDATE squadron
SET site_id = 18
WHERE id in (20);
