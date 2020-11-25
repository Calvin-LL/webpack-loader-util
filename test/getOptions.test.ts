import MyWebpackTestCompiler from "./helpers/MyWebpackTestCompiler";

describe.each([4, 5] as const)("v%d getOptions", (webpackVersion) => {
  it("should work with no options and no query", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile();
    const warning = bundle.stats.compilation.warnings[0].warning.message;
    const options = JSON.parse(warning);

    expect(options).toMatchObject({});
  });

  it("should work with options {test: 1}", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        test: 1,
      },
    });
    const warning = bundle.stats.compilation.warnings[0].warning.message;
    const options = JSON.parse(warning);

    expect(options).toMatchObject({ test: 1 });
  });

  it("should work with no options and JSON query {test: 2}", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      fileContentOverride: `__export__ = require('./test.txt?{"test": 2}');`,
    });
    const warning = bundle.stats.compilation.warnings[0].warning.message;
    const options = JSON.parse(warning);

    expect(options).toMatchObject({ test: 2 });
  });

  it("should work with no options and string query test=a", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      fileContentOverride: `__export__ = require("./test.txt?test=a");`,
    });
    const warning = bundle.stats.compilation.warnings[0].warning.message;
    const options = JSON.parse(warning);

    expect(options).toMatchObject({ test: "a" });
  });

  it("should work with no options and string query test=1", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      fileContentOverride: `__export__ = require("./test.txt?test=1");`,
    });
    const warning = bundle.stats.compilation.warnings[0].warning.message;
    const options = JSON.parse(warning);

    expect(options).toMatchObject({ test: "1" });
  });

  describe("with includeQuery = false", () => {
    it("should work with no options and string query test=a", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require("./test.txt?test=a");`,
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({});
    });

    it("should work with options {test: 1} and string query test=a", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require("./test.txt?test=a");`,
        loader: "testLoaderNoQuery",
        loaderOptions: { test: 1 },
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({ test: 1 });
    });
  });

  it("should override options with query, with options { test: 0 } and string query test=a", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      fileContentOverride: `__export__ = require("./test.txt?test=a");`,
      loaderOptions: { test: 0 },
    });
    const warning = bundle.stats.compilation.warnings[0].warning.message;
    const options = JSON.parse(warning);

    expect(options).toMatchObject({ test: "a" });
  });

  describe("with convertStringQueryParamsToNumber = true", () => {
    it("should work with no options and JSON query {test: 2}", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require('./test.txt?{"test": 2}');`,
        loader: "testLoaderWithNumberConversion",
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({ test: 2 });
    });

    it("should work with no options and string query test=a", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require("./test.txt?test=a");`,
        loader: "testLoaderWithNumberConversion",
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({ test: "a" });
    });

    it("should work with no options and string query test=1", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require("./test.txt?test=1");`,
        loader: "testLoaderWithNumberConversion",
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({ test: 1 });
    });

    it("should work with no options and string query test=1&test2=a", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require("./test.txt?test=1&test2=a");`,
        loader: "testLoaderWithNumberConversion",
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({ test: 1, test2: "a" });
    });

    it("should override options with query, with options { test: 0 } and string query test=1&test2=a", async () => {
      const compiler = new MyWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require("./test.txt?test=1&test2=a");`,
        loader: "testLoaderWithNumberConversion",
        loaderOptions: { test: 0 },
      });
      const warning = bundle.stats.compilation.warnings[0].warning.message;
      const options = JSON.parse(warning);

      expect(options).toMatchObject({ test: 1, test2: "a" });
    });
  });
});
