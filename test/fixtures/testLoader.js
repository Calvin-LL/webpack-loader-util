const { getOptions } = require("../../test-dist/index");

module.exports = function (content) {
  const options = getOptions(this);
  const optionsString = JSON.stringify(options);

  this.emitWarning(new Error(`${optionsString}`));

  return `module.exports = ${JSON.stringify(content)}`;
};

module.exports.raw = false;
