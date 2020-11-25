import loaderUtils from "loader-utils";
import { loader } from "webpack";

type OPTIONS = Readonly<Record<string, any>> | null;

export function getOptions<T extends Record<string, any> = any>(
  loadContext: loader.LoaderContext,
  includeQuery = true,
  convertStringQueryParamsToNumber = false
): T {
  const options = loaderUtils.getOptions(loadContext) as OPTIONS;
  const queryObject =
    includeQuery && loadContext.resourceQuery
      ? (loaderUtils.parseQuery(loadContext.resourceQuery) as Partial<OPTIONS>)
      : null;
  const fullOptions: Partial<OPTIONS> = {
    ...options,
    ...(convertStringQueryParamsToNumber
      ? attemptToConvertValuesToNumbers(queryObject)
      : queryObject),
  };

  return fullOptions as T;
}

function attemptToConvertValuesToNumbers<T extends OPTIONS>(object: T): T {
  if (!object) return null as T;

  const result = { ...object } as Record<string, any>;

  Object.keys(result).forEach((key) => {
    if (isNumeric(result[key])) {
      result[key] = Number(result[key]);
    }
  });

  return result as T;
}

// https://stackoverflow.com/a/175787
function isNumeric(string: any): boolean {
  if (typeof string !== "string") return false;
  // @ts-expect-error using isNaN to test string, works but typescript doesn't like
  return !isNaN(string) && !isNaN(parseFloat(string));
}
