ALTER TABLE site ADD COLUMN site_type VARCHAR(64) NOT NULL DEFAULT '';

UPDATE site set site_type = 'DGSCoreSite' where id in (
  1, 2, 3, 4, 5
);

UPDATE site set site_type = 'DMSSite' where id in (
  13, 14, 15, 16, 17, 18
);

UPDATE site set site_type = 'GuardSite' where id in (
  7, 8, 9, 10, 11, 12
);

DELETE FROM squadron WHERE id = 8;
DELETE FROM site WHERE id = 6;

ALTER TABLE site Add COLUMN full_name VARCHAR(64) NOT NULL DEFAULT '';

UPDATE site SET full_name = 'DGS 1' WHERE id = 1;
UPDATE site SET full_name = 'DGS 2' WHERE id = 2;
UPDATE site SET full_name = 'DGS 3' WHERE id = 3;
UPDATE site SET full_name = 'DGS 4' WHERE id = 4;
UPDATE site SET full_name = 'DGS 5' WHERE id = 5;
UPDATE site SET full_name = 'DGS Arkansas' WHERE id = 7;
UPDATE site SET full_name = 'DGS Alabama' WHERE id = 8;
UPDATE site SET full_name = 'DGS Indiana' WHERE id = 9;
UPDATE site SET full_name = 'DGS Kansas' WHERE id = 10;
UPDATE site SET full_name = 'DGS Massachusetts' WHERE id = 11;
UPDATE site SET full_name = 'DGS Nevada' WHERE id = 12;
UPDATE site SET full_name = 'DMS Georgia' WHERE id = 13;
UPDATE site SET full_name = 'DMS Maryland' WHERE id = 14;
UPDATE site SET full_name = 'DMS Germany' WHERE id = 15;
UPDATE site SET full_name = 'DMS Hawaii' WHERE id = 16;
UPDATE site SET full_name = 'DMS Texas' WHERE id = 17;
UPDATE site SET full_name = 'DMS Utah' WHERE id = 18;