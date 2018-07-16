UPDATE join_airman_qualification SET currency_expiration = CURDATE() + INTERVAL 90 DAY;
UPDATE join_airman_certification SET currency_expiration = CURDATE() + INTERVAL 90 DAY;