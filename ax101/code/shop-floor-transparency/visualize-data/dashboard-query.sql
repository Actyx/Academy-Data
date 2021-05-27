-- [[start:machine-state-query]]
SELECT
  $__time(time),
  new_state,
  device
FROM
  machine_state_change
WHERE
  $__timeFilter(time)
-- [[end:machine-state-query]]