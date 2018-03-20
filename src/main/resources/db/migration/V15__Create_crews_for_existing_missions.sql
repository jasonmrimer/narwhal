INSERT INTO crew (mission_id)
  SELECT mission_id
  FROM mission
  WHERE mission_id NOT IN (
    SELECT mission_id
    FROM crew
  );