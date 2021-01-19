import path from "path";

import {
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";
import { CompileOptions } from "@calvin-l/webpack-loader-test-util/dist/WebpackTestCompiler";

const loader = [
  "testLoader",
  "testLoaderNoQuery",
  "testLoaderWithNumberConversion",
] as const;

interface MyCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: Record<string, any>;
  loader?: typeof loader[number];
}

export default class MyWebpackTestCompiler extends WebpackTestCompiler.default {
  compile(optioins: MyCompileOptions = {}): Promise<WebpackTestBundle.default> {
    const {
      entryFileName = "index.js",
      loaderOptions = {},
      loader = "testLoader",
    } = optioins;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
      rules: [
        {
          test: /\.txt$/i,
          use: [
            {
              loader: path.resolve(fixturesDir, `${loader}.js`),
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
