import isEqual from 'lodash.isequal'

/**
 * Memoizes a function by caching its result based on the input arguments.
 *
 * This utility function takes a function `fnToMemoize` and returns a memoized version of it.
 * The memoized function will cache its result based on the input arguments. If the same set of
 * arguments is passed again, the cached result will be returned without re-executing the function.
 *
 * @param {Function} fnToMemoize - The function to memoize.
 * @returns {Function} - A memoized version of the input function.
 *
 * @example
 * // Define a function to memoize
 * function expensiveOperation(a, b) {
 *   console.log('Performing expensive operation...');
 *   return a + b;
 * }
 *
 * // Create a memoized version of the function
 * const memoizedOperation = useMemo(expensiveOperation);
 *
 * // Call the memoized function
 * const result1 = memoizedOperation(2, 3); // Expensive operation is performed.
 * const result2 = memoizedOperation(2, 3); // Cached result is returned without re-computation.
 */
export function useMemo<T extends Function>(fnToMemoize: T): T {
  let prevArgs: unknown[] = [{}]
  let result: unknown

  return function (...newArgs: unknown[]) {
    const args = JSON.parse(JSON.stringify(newArgs))
    if (!isEqual(prevArgs, args)) {
      result = fnToMemoize(...args)
      prevArgs = JSON.parse(JSON.stringify(args))
    }
    return result
  } as unknown as T
}
