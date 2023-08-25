import * as _ from 'lodash'

export function useMemo<T extends Function>(fnToMemoize: T): T {
  let prevArgs: unknown[] = [{}]
  let result: unknown

  return function (...newArgs: unknown[]) {
    if (!_.isEqual(prevArgs, newArgs)) {
      result = fnToMemoize(...newArgs)
      prevArgs = newArgs
    }
    return result
  } as unknown as T
}
