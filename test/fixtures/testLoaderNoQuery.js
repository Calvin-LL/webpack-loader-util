const { getOptions } = require("../../dist/index");

module.exports = function (content) {
  const options = getOptions(this, false);
  const optionsString = JSON.stringify(options);

  this.emitWarning(new Error(`${optionsString}`));

  return `module.exports = ${JSON.stringify(content)}`;
};

module.exports.raw = false;
