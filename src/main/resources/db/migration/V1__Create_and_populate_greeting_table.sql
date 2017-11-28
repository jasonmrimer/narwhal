CREATE TABLE greeting (
  id     INT         NOT NULL,
  phrase VARCHAR(64) NOT NULL
);

INSERT INTO
  greeting (id, phrase)
VALUES
  (1, 'Whats up'),
  (2, 'Hola'),
  (3, 'Bonjour'),
  (4, 'Moshi Moshi'),
  (5, 'Gutentag');