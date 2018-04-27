CREATE TABLE schedule (
  id        INT (11) NOT NULL AUTO_INCREMENT,
  type      VARCHAR(64) NOT NULL,
  sunday    BOOLEAN     NOT NULL,
  monday    BOOLEAN     NOT NULL,
  tuesday   BOOLEAN     NOT NULL,
  wednesday BOOLEAN     NOT NULL,
  thursday  BOOLEAN     NOT NULL,
  friday    BOOLEAN     NOT NULL,
  saturday  BOOLEAN     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_schedule_name ( type )
);

INSERT INTO schedule VALUES
  (1, 'No Schedule', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  (2, 'Front Half', TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE),
  (3, 'Back Half', FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE),
  (4, 'Monday - Friday', FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE);

CREATE TABLE join_airman_schedule (
  id INT (11) NOT NULL AUTO_INCREMENT,
  airman_id INT (11) NOT NULL,
  schedule_id INT (11) NOT NULL DEFAULT 1,
  start_date DATETIME NOT NULL,
  end_date DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT join_airman_schedule_ibfk_1 FOREIGN KEY (airman_id) references airman (id),
  CONSTRAINT join_airman_schedule_ibfk_2 FOREIGN KEY (schedule_id) references schedule (id)
);

INSERT INTO join_airman_schedule (airman_id, schedule_id, start_date)
  SELECT a.id, sc.id, NOW()
    FROM airman a
      join schedule sc
      WHERE sc.id = 1;