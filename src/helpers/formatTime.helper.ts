/**
 * Format time in seconds to a readable format.
 * @param {number} totalSeconds - Time in seconds
 * @returns {string} A string that contains the formatted time
 *
 * @example
 * // returns '1d 01h 01m 01s'
 * formatTime(90061)
 */

export function formatTime(totalSeconds: number): string {
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 3600) % 24
  const days = Math.floor(totalSeconds / 86400)

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
  } else if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}m ${seconds
      .toString()
      .padStart(2, '0')}s`
  } else {
    return `${seconds.toString().padStart(2, '0')}s`
  }
}
