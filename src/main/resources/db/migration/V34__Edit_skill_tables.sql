ALTER TABLE join_airman_qualification
  MODIFY periodic_due DATETIME,
  MODIFY last_sat DATETIME,
  MODIFY currency_expiration DATETIME;

ALTER TABLE join_airman_certification
  MODIFY periodic_due DATETIME,
  MODIFY last_sat DATETIME,
  MODIFY currency_expiration DATETIME;