/**
 * Memoizes a function by caching its result based on the input arguments.
 *
 * This utility function takes a function `fnToMemoize` and returns a memoized version of it.
 * The memoized function will cache its result based on the input arguments. If the same set of
 * arguments is passed again, the cached result will be returned without re-executing the function.
 *
 * @template T - The type of the function to memoize.
 * @param {T} fnToMemoize - The function to memoize. It can take any number of arguments and return any value.
 * @returns {T} - A memoized version of the input function.
 *
 * @example
 * // Define a function to memoize
 * function expensiveOperation(a: number, b: number): number {
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
 *
 * @example
 * // Define a function with an object input
 * function processObject(data: { value: number }): number {
 *   console.log('Processing object...');
 *   return data.value * 2;
 * }
 *
 * const memoizedProcessObject = useMemo(processObject);
 * const obj = { value: 10 };
 * const result1 = memoizedProcessObject(obj); // Processing object is performed.
 * const result2 = memoizedProcessObject(obj); // Cached result is returned.
 */

export function useMemo<T extends (...args: any[]) => any>(fnToMemoize: T): T {
  const primitiveCache = new Map<string, any>();
  const objectCache = new WeakMap<object, any>();

  return function (...args: any[]): ReturnType<T> {
    const primitiveKeyParts: string[] = [];
    const objectKeys: object[] = [];

    // Separar os argumentos em primitivos e objetos
    args.forEach(arg => {
      if (typeof arg === 'object' && arg !== null) {
        objectKeys.push(arg);
      } else {
        primitiveKeyParts.push(`${typeof arg}:${String(arg)}`);
      }
    });

    const primitiveKey = primitiveKeyParts.join('|');

    // Caso 1: Apenas valores primitivos
    if (objectKeys.length === 0) {
      if (primitiveCache.has(primitiveKey)) {
        return primitiveCache.get(primitiveKey);
      }
      const result = fnToMemoize(...args);
      primitiveCache.set(primitiveKey, result);
      return result;
    }

    // Caso 2: Valores com objetos
    let currentCache = objectCache;

    for (const obj of objectKeys) {
      if (!currentCache.has(obj)) {
        currentCache.set(obj, new WeakMap());
      }
      currentCache = currentCache.get(obj);
    }

    const resultKey = { key: primitiveKey };
    if (!currentCache.has(resultKey)) {
      const result = fnToMemoize(...args);
      currentCache.set(resultKey, result);
      return result;
    }
    return currentCache.get(resultKey);
  } as T;
}
