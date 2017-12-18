ALTER TABLE join_airman_qualification
  ADD COLUMN expiration_date DATE;

ALTER TABLE join_airman_certification
  ADD COLUMN expiration_date DATE;

update join_airman_qualification SET
  expiration_date = '2018-01-18' where airman_id in (1,2,3);

update join_airman_certification SET
  expiration_date = '2018-01-25' where airman_id in (1,2,3);