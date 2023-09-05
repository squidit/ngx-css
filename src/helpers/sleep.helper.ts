/**
 * Sleeps for a specified number of milliseconds.
 *
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 * 
 * @example
 * // Sleep for 1000 milliseconds (1 second)
 * await sleep(1000);
 */
export async function sleep(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}