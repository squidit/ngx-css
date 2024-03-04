import { Pipe, PipeTransform } from '@angular/core'

/**
 * A custom Angular pipe for getting the age from a birthdate.
 *
 * @param {string} date - The birthdate to get the age from.
 * @returns {string} - The age from the birthdate.
 */

@Pipe({ name: 'birthdate' })
export class BirthdatePipe implements PipeTransform {
  /**
   * A custom Angular pipe for getting the age from a birthdate.
   *
   * @param {string} date - The birthdate to get the age from.
   * @returns {string} - The age from the birthdate.
   */
  transform(date: string): string {
    const diffSinseStart = 1970
    if (date) {
      const ageDifMs = Date.now() - new Date(date).getTime()
      const ageDate = new Date(ageDifMs)
      return Math.abs(ageDate.getUTCFullYear() - diffSinseStart).toString()
    }
    return '0'
  }
}
