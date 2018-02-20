CREATE TABLE crew (
  id         INT(11)     NOT NULL AUTO_INCREMENT,
  mission_id VARCHAR(64) NOT NULL UNIQUE,
  PRIMARY KEY (id),
  CONSTRAINT join_crew_ibfk_1 FOREIGN KEY (mission_id) REFERENCES mission (mission_id)
);

CREATE TABLE join_crew_airman (
  id        INT(11) NOT NULL AUTO_INCREMENT,
  crew_id   INT(11) NOT NULL,
  airman_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT join_crew_airman_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id),
  CONSTRAINT join_crew_airman_ibfk_2 FOREIGN KEY (crew_id) REFERENCES crew (id),
  CONSTRAINT unique_crew_airman UNIQUE (crew_id, airman_id)
);