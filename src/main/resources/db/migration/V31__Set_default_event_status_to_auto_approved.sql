ALTER TABLE event ALTER COLUMN status SET DEFAULT 'AUTO_APPROVED';
UPDATE event SET status = 'AUTO_APPROVED';