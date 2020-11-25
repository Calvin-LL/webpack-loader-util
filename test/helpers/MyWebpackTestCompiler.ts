import path from "path";

import {
  CompileOptions,
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-util";

interface MyCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: Record<string, any>;
}

export default class MyWebpackTestCompiler extends WebpackTestCompiler {
  compile(optioins: MyCompileOptions = {}): Promise<WebpackTestBundle> {
    const { entryFileName = "index.js", loaderOptions = {} } = optioins;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
      rules: [
        {
          test: /\.txt$/i,
          use: [
            {
              loader: path.resolve(fixturesDir, "testLoader1.js"),
              options: loaderOptions,
            },
          ],
        },
      ],
    };

    return super.compile({
      ...optioins,
      entryFilePath: path.resolve(fixturesDir, entryFileName),
    });
  }
}
