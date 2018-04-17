CREATE TABLE role (
  id   INT(11)     NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

INSERT INTO role VALUES
  (1, 'ADMIN'),
  (2, 'WRITER'),
  (3, 'READER');

ALTER TABLE profile
  ADD COLUMN role_id INT NOT NULL DEFAULT 3;

ALTER TABLE profile
  ADD CONSTRAINT role_ibfk_1 FOREIGN KEY (role_id) REFERENCES role (id);

UPDATE profile
SET profile.role_id = 1;
