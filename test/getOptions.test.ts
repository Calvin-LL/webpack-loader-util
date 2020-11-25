import MyWebpackTestCompiler from "./helpers/MyWebpackTestCompiler";

describe.each([4, 5] as const)("v%d getOptions", (webpackVersion) => {
  it("should work with no options", async () => {
    const compiler = new MyWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile();

    expect(bundle.stats.compilation.warnings).toMatchSnapshot("warnings");
  });
});
