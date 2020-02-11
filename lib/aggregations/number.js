module.exports = function (number) {
  if (number != null && !number.valid) { return; }
  return number.normal;
};
