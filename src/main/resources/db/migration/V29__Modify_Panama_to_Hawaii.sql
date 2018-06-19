UPDATE schedule
SET
  sunday = FALSE,
  monday = TRUE,
  tuesday = TRUE,
  wednesday = FALSE,
  thursday = FALSE,
  friday = TRUE,
  saturday = TRUE
WHERE type = 'Panama A';

UPDATE schedule
SET
  sunday = TRUE,
  monday = FALSE,
  tuesday = FALSE,
  wednesday = TRUE,
  thursday = TRUE,
  friday = FALSE,
  saturday = FALSE
WHERE type = 'Panama B';