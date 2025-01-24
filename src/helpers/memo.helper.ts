/**
 * Memoizes a function by caching its result based on the input arguments.
 *
 * This utility function takes a function `fnToMemoize` and returns a memoized version of it.
 * The memoized function automatically determines the best caching strategy:
 * - If the first argument is an object, it uses a `WeakMap` for efficient caching.
 * - For primitive arguments or multiple arguments, it uses a `Map` with serialized keys.
 *
 * The function ensures that identical inputs return cached results, avoiding redundant computations.
 *
 * @template T - The type of the function to memoize.
 * @param {T} fnToMemoize - The function to memoize.
 * @returns {T} - A memoized version of the input function.
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
 * // Call the memoized function with primitive arguments
 * const result1 = memoizedOperation(2, 3); // Expensive operation is performed.
 * const result2 = memoizedOperation(2, 3); // Cached result is returned without re-computation.
 *
 * @example
 * // Define a function to memoize with object arguments
 * function processData(data) {
 *   console.log('Processing data...');
 *   return data.value * 2;
 * }
 *
 * // Create a memoized version of the function
 * const memoizedProcess = useMemo(processData);
 *
 * // Call the memoized function with an object
 * const data = { value: 10 };
 * const result1 = memoizedProcess(data); // Processing data is performed.
 * const result2 = memoizedProcess(data); // Cached result is returned without re-computation.
 *
 * @throws {Error} - Throws an error if using `WeakMap` and the first argument is not an object.
 */

export function useMemo<T extends (...args: any[]) => any>(fnToMemoize: T): T {
  const mapCache = new Map<string, any>()
  const weakMapCache = new WeakMap<object, any>()

  return function (...args: any[]) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      const key = args[0]
      if (weakMapCache.has(key)) {
        return weakMapCache.get(key)
      }
      const result = fnToMemoize(...args)
      weakMapCache.set(key, result)
      return result
    } else {
      const key = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join('|')
      if (mapCache.has(key)) {
        return mapCache.get(key)
      }
      const result = fnToMemoize(...args)
      mapCache.set(key, result)
      return result
    }
  } as T
}
