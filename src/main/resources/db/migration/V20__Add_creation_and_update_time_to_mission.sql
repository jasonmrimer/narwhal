ALTER TABLE mission ADD COLUMN updated_at datetime DEFAULT NULL;

UPDATE mission SET updated_at = NOW();