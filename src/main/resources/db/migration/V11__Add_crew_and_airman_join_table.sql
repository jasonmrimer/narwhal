CREATE TABLE crew (
  id      INT         NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO
  crew (id, name)
VALUES
  (1, 'SUPER CREW'),
  (2, 'LAME CREW');

CREATE TABLE join_airman_crew (
  airman_id        INT NOT NULL,
  crew_id INT NOT NULL,

  FOREIGN KEY (airman_id) REFERENCES airman (id),
  FOREIGN KEY (crew_id) REFERENCES crew (id),

  PRIMARY KEY (airman_id, crew_id)
);

INSERT INTO
  join_airman_crew (airman_id, crew_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 2);
