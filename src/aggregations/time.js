module.exports = function (time) {
  if (time != null && !time.valid) { return; }
  return time.normal != null
    ? time.normal.toISOString()
    : undefined;
};
