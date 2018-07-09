CREATE TABLE template (
  id    INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE template_item (
  id          INT(11) NOT NULL AUTO_INCREMENT,
  order_int   INT(11) NOT NULL,
  critical    BOOLEAN NOT NULL,
  template_id INT(11),
  PRIMARY KEY (id)
);

ALTER TABLE template_item
  ADD CONSTRAINT fk_template_id FOREIGN KEY (template_id) REFERENCES template (id);

ALTER TABLE join_mission_airman
  ADD COLUMN order_int INT(11) DEFAULT 0;
ALTER TABLE join_mission_airman
  ADD COLUMN template_item_id INT(11);
ALTER TABLE join_mission_airman
  ADD CONSTRAINT fk_template_item_id FOREIGN KEY (template_item_id) REFERENCES template_item (id);
ALTER TABLE join_mission_airman
  MODIFY airman_id INT(11) DEFAULT NULL;

INSERT INTO template VALUES
  (1, 'Default');

INSERT INTO template_item VALUES
  (1, 1, TRUE, 1),
  (2, 2, TRUE, 1),
  (3, 3, TRUE, 1),
  (4, 4, FALSE, 1),
  (5, 5, FALSE, 1);