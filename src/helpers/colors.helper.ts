import { Injectable } from '@angular/core'

/**
 * A utility service for working with colors in Angular applications.
 *
 * This service provides methods to retrieve CSS variable values and to lighten or darken colors.
 *
 * @example
 * // Inject the ColorsHelper service and use its methods:
 * constructor(private colorsHelper: ColorsHelper) { }
 * 
 * // Or instance a new class
 * const colorsHelper = new ColorsHelper()
 *
 * const mainColor = this.colorsHelper.getCssVariableValue('--main-color');
 * const lighterColor = this.colorsHelper.lightenDarkenColor('#FF5733', 20);
 */
@Injectable({
  providedIn: 'root',
})
export class ColorsHelper {
  /**
   * Get the value of a CSS variable.
   *
   * @param {string} variableName - The name of the CSS variable (e.g., '--main-color').
   * @returns {string} The value of the CSS variable or the variableName if not found.
   */
  getCssVariableValue(variableName: string): string {
    const clearVar = variableName?.replace('var(', '')?.replace(')', '')?.trim()
    return getComputedStyle(document.documentElement).getPropertyValue(clearVar) || variableName
  }

  /**
   * Lighten or darken a color by a specified amount.
   *
   * @param {string} color - The color to be adjusted (e.g., '#FF5733' or 'var(--main-color)').
   * @param {number} amount - The amount to lighten or darken the color (positive for lighten, negative for darken).
   * @returns {string} The adjusted color in hexadecimal format (e.g., '#FF5733').
   */
  lightenDarkenColor(color: string, amount: number): string {
    color = color?.trim()
    let colorWithoutHash = color?.replace('var(', '')?.replace(')', '')?.replace('#', '')
    if (colorWithoutHash?.length === 3) {
      colorWithoutHash = colorWithoutHash
        .split('')
        .map((c) => `${c}${c}`)
        .join('')
    }

    const getColorChannel = (substring: string) => {
      let colorChannel = Math.max(Math.min(255, parseInt(substring, 16) + amount), 0).toString(16)
      if (colorChannel?.length < 2) {
        colorChannel = `0${colorChannel}`
      }
      return colorChannel
    }

    const colorChannelRed = getColorChannel(colorWithoutHash?.substring(0, 2))
    const colorChannelGreen = getColorChannel(colorWithoutHash?.substring(2, 4))
    const colorChannelBlue = getColorChannel(colorWithoutHash?.substring(4, 6))

    return `#${colorChannelRed}${colorChannelGreen}${colorChannelBlue}`
  }
}
