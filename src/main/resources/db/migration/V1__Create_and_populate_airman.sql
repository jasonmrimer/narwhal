CREATE TABLE airman (
  id         INT         NOT NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name  VARCHAR(64) NOT NULL
);

INSERT INTO
  airman (id, first_name, last_name)
VALUES
  (1, 'FirstName1', 'LastName1'),
  (2, 'FirstName2', 'LastName2'),
  (3, 'FirstName3', 'LastName3');