CREATE TABLE certification (
  id      INT         NOT NULL,
  title   VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO
  certification (id, title)
VALUES
  (1, 'Laser Vision'),
  (2, 'Flight'),
  (3, 'Super Speed');

CREATE TABLE join_airman_certification (
  airman_id        INT NOT NULL,
  certification_id INT NOT NULL,

  FOREIGN KEY (airman_id) REFERENCES airman (id),
  FOREIGN KEY (certification_id) REFERENCES certification (id),

  PRIMARY KEY (airman_id, certification_id)
);

INSERT INTO
  join_airman_certification(airman_id, certification_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (3, 1);
