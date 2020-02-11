module.exports = function (boolean) {
  if (boolean != null && !boolean.valid) { return; }
  return boolean.normal;
};
