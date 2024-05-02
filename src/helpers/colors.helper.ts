import { GetWindow } from './window.helper'
import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'

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
   * Initializes a new instance of the `ColorsHelper` class.
   * @param document
   * @param getWindow
   */
  constructor(@Inject(DOCUMENT) private document: Document, public getWindow: GetWindow) {}
  /**
   * Get the value of a CSS variable.
   *
   * @param {string} variableName - The name of the CSS variable (e.g., '--main-color').
   * @returns {string} The value of the CSS variable or the variableName if not found.
   */
  getCssVariableValue(variableName: string): string {
    if (this.document?.documentElement) {
      const clearVar = variableName?.replace('var(', '')?.replace(')', '')?.trim()
      /**
       * Get the value of the CSS variable from the document element.
       */
      return this.getWindow.window()?.getComputedStyle(this.document?.documentElement).getPropertyValue(clearVar) ?? variableName
    }
    return variableName
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

    /**
     * Retrieves the color channel value based on the given substring and amount.
     * @param {string} substring - The substring representing the color channel.
     * @returns {string} The color channel value as a string.
     */
    const getColorChannel = (substring: string): string => {
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
