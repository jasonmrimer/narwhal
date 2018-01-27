CREATE TABLE mission (
  mission_id VARCHAR(64) NOT NULL,
  ato_mission_number VARCHAR(64),
  start_date_time DATETIME,
  end_date_time DATETIME,
  PRIMARY KEY (mission_id)
);