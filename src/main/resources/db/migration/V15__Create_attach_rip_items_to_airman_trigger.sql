CREATE TRIGGER attach_rip_items AFTER INSERT ON airman
  FOR EACH ROW
    INSERT INTO join_airman_rip_item (airman_id, rip_item_id)
      SELECT new.id, id
      FROM rip_item;