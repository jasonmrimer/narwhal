ALTER TABLE certification ADD COLUMN site_id INT NOT NULL DEFAULT 13;
ALTER TABLE certification ADD CONSTRAINT site_ibfk_1 FOREIGN KEY (site_id) REFERENCES site (id);