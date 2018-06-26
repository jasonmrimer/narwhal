ALTER TABLE event ADD COLUMN supervisor_approval_time DATETIME DEFAULT NULL;
ALTER TABLE event ADD COLUMN supervisor_profile_id INT(11) DEFAULT NULL;
ALTER TABLE event ADD CONSTRAINT fk_supervisor_profile_id FOREIGN KEY (supervisor_profile_id) REFERENCES profile (id);
ALTER TABLE event ADD COLUMN supervisor_approval VARCHAR(65) DEFAULT NULL;

ALTER TABLE event ADD COLUMN scheduler_approval_time DATETIME DEFAULT NULL;
ALTER TABLE event ADD COLUMN scheduler_profile_id INT(11) DEFAULT NULL;
ALTER TABLE event ADD CONSTRAINT fk_scheduler_profile_id FOREIGN KEY (scheduler_profile_id) REFERENCES profile (id);
ALTER TABLE event ADD COLUMN scheduler_approval VARCHAR(65) DEFAULT NULL;