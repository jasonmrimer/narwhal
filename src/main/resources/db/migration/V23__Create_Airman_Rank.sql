CREATE TABLE rank (
  id           INT (11) NOT NULL AUTO_INCREMENT,
  abbreviation VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_rank ( abbreviation)
);

INSERT INTO rank (id,  abbreviation) VALUES
  (1, 'No Rank'),
  (2, 'AB'),
  (3, 'Amn'),
  (4, 'A1C'),
  (5, 'SrA'),
  (6, 'SSgt'),
  (7, 'TSgt'),
  (8, 'MSgt'),
  (9, 'SMSgt'),
  (10, '2Lt.'),
  (11, '1Lt.'),
  (12, 'Capt.'),
  (13, 'Maj.'),
  (14, 'Lt Col.'),
  (15, 'Col.');

ALTER TABLE airman
  ADD COLUMN rank_id INT NOT NULL DEFAULT 1,
  ADD CONSTRAINT fk_rank_id FOREIGN KEY (rank_id) REFERENCES rank (id);

