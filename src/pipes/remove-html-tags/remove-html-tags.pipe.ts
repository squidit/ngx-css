import { Pipe, PipeTransform } from '@angular/core'

/**
 * A custom Angular pipe for removing HTML tags from a given string.
 *
 * @example
 * // In your component template:
 * // Assuming 'htmlString' is a string containing HTML tags.
 * <p>{{ htmlString | removeHtmlTags }}</p>
 *
 * @param {string | null | undefined} value - The input string from which to remove HTML tags.
 * @returns {string} - The string with HTML tags removed.
 */

@Pipe({ name: 'removeHtmlTags' })
export class RemoveHtmlTagsPipe implements PipeTransform {
  /**
   * Transforms a string by removing any HTML tags.
   *
   * @param {string | null | undefined} value - The input string to transform.
   * @returns {string} - The transformed string with HTML tags removed.
   */
  transform(value: string | null | undefined): string {
    if (value == null) {
      return ''
    }
    const regex = /<\/?[^>]+(>|$)|&nbsp;/g
    return value.replace(regex, '')
  }
}
