CREATE TABLE join_airman_rip_item (
  id INT (11) NOT NULL AUTO_INCREMENT,
  airman_id INT (11) NOT NULL,
  rip_item_id INT (11) NOT NULL,
  expiration_date DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT join_airman_rip_item_ibfk_1 FOREIGN KEY (airman_id) REFERENCES airman (id),
  CONSTRAINT join_airman_rip_item_ibfk_2 FOREIGN KEY (rip_item_id) REFERENCES rip_item (id),
  CONSTRAINT unique_airman_rip_item UNIQUE (airman_id, rip_item_id)
);

INSERT INTO join_airman_rip_item (airman_id, rip_item_id)
SELECT a.id, ri.id
FROM airman a
JOIN rip_item ri
ON 1 = 1;

UPDATE rip_item SET title = 'In-Flight Emergency' WHERE id = 9;
UPDATE rip_item SET title = 'Non-Emergency Abort' WHERE id = 11;
UPDATE rip_item SET title = 'Sensor/Equipment Outage' WHERE id = 12;
