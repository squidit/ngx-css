import isEqual from 'lodash.isequal'

export function useMemo<T extends Function>(fnToMemoize: T): T {
  let prevArgs: unknown[] = [{}]
  let result: unknown

  return function (...newArgs: unknown[]) {
    if (!isEqual(prevArgs, newArgs)) {
      result = fnToMemoize(...newArgs)
      prevArgs = newArgs
    }
    return result
  } as unknown as T
}
