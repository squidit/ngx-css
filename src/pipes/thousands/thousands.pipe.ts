import { Pipe, PipeTransform } from '@angular/core';

/**
 * A custom Angular pipe for formatting numbers with thousand suffixes (e.g., K, M, G).
 *
 * @example
 * // In your component template:
 * // Assuming 'value' is a number.
 * {{ value | thousandSuff:'round':2 }}
 *
 * @param {number} input - The number to format.
 * @param {string} round - Optional. Specify 'round' to round the number to the nearest whole number or 'floor' to always round down.
 * @param {number} toFixedArgs - Optional. The number of decimal places to round to.
 * @returns {string} - The formatted number with suffix.
 */

@Pipe({ name: 'thousandSuff', standalone: true })
export class ThousandSuffixesPipe implements PipeTransform {
  /**
   * Transforms a number into a formatted string with thousand suffixes (e.g., K, M, G).
   *
   * @param {number} input - The number to format.
   * @param {string} round - Optional. Specify 'round' to round the number to the nearest whole number if below 1000 and no suffix is applied. Use 'floor' to always round down.
   * @param {number} toFixedArgs - Optional. The number of decimal places to round to.
   * @returns {string} - The formatted number with suffix.
   */
  transform(input: any, round?:'round' | 'floor', toFixedArgs = 0): string {
    const suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

    // Handle special cases
    if (Number.isNaN(input) || input === null || (!input && input !== 0)) {
      return '∞';
    }

    // If input is less than 1000, return it as is (optionally rounded)
    if (input < 1000) {
      if (round === 'round') {
        return String(Math.round(input));
      }
      return String(input);
    }

    // Calculate the appropriate suffix and format the number
    const exp = Math.floor(Math.log(input) / Math.log(1000));
    const result = input / Math.pow(1000, exp);
    
    if (round === 'floor') {
      const multiplier = Math.pow(10, toFixedArgs);
      const floored = Math.floor(result * multiplier) / multiplier;
      return floored.toFixed(toFixedArgs) + suffixes[exp - 1];
    }
    
    return result.toFixed(toFixedArgs) + suffixes[exp - 1];
  }
}
