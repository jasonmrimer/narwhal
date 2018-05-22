ALTER TABLE profile
  ADD COLUMN squadron_id INT DEFAULT NULL
  references squadron (id);

