const { getOptions } = require("../../dist/index");

module.exports = function (content) {
  this.emitWarning(getOptions(this));

  return `module.exports = ${JSON.stringify(content)}`;
};

module.exports.raw = false;
