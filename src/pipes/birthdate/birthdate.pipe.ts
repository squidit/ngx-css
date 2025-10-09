import { Pipe, PipeTransform } from '@angular/core';

/**
 * A custom Angular pipe for getting the age from a birthdate.
 *
 * @param {string} date - The birthdate to get the age from.
 * @returns {string} - The age from the birthdate.
 */

@Pipe({ name: 'birthdate', standalone: true })
export class BirthdatePipe implements PipeTransform {
  /**
   * A custom Angular pipe for getting the age from a birthdate.
   *
   * @param {string} date - The birthdate to get the age from.
   * @returns {string} - The age from the birthdate.
   */
  transform(date: string): string {
    const epochYear = 1970; // Used as the base year for age calculation
    if (date > new Date().toISOString().split('T')[0]) {
      return '0';
    }
    if (date) {
      const ageDifMs = Date.now() - new Date(date).getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - epochYear).toString();
      if (isNaN(parseInt(age))) {
        return '0';
      }
      return age;
    }
    return '0';
  }
}
