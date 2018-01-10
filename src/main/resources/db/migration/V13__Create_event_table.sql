CREATE TABLE event (
  id  INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(64),
  start_time DATETIME,
  end_time DATETIME,
  airman_id INT,
  FOREIGN KEY (airman_id) REFERENCES airman (id),
  PRIMARY KEY (id)
);


INSERT INTO event (title, description, start_time, end_time, airman_id)
VALUES ('dentist', '', '2018-01-18 08:00:00', '2018-01-18 09:00:00', 1),
('vacation', '', '2018-01-18 08:00:00', '2018-01-18 23:00:00', 2),
('doctors', '', '2018-01-18 10:00:00', '2018-01-18 12:00:00', 3);