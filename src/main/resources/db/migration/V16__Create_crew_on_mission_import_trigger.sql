INSERT INTO crew (mission_id)
  SELECT mission_id
  FROM mission
  WHERE mission_id NOT IN (
    SELECT mission_id
    FROM crew
  );

CREATE TRIGGER attach_mission_to_crew
  AFTER INSERT
  ON mission
  FOR EACH ROW
  INSERT INTO crew (mission_id) VALUES (new.mission_id);