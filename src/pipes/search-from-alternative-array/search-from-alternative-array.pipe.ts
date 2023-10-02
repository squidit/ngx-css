import { Pipe, PipeTransform } from '@angular/core'

/**
 * A custom Angular pipeline to filter an array of objects and transform another array based on a search string.
 *
 * @example
 * // In your component template:
 * // Assuming 'items' is an array of objects and 'searchTerm' is a string.
 * <ul>
 *   <li *ngFor="let item of items | searchFromAlternativeArray: searchTerm">{{ item.name }}</li>
 * </ul>
 *
 * @param {any[]} value - The array of objects to filter.
 * @param {string} search - The search string to filter by.
 * @returns {any[]} - The filtered array of objects.
 */

@Pipe({ name: 'searchFromAlternativeArray' })
export class SearchFromAlternativeArrayPipe implements PipeTransform {
  /**
   * Transforms an array of objects by filtering into an alternate array based on a search string.
   *
   * @param {any[]} value - The array of objects to transform.
   * @param {string} search - The search string to filter by.
   * @param {any[]} alternative - The array to filter the values.
   * @returns {any[]} - The filtered array of objects.
   */
  transform(value: any, search: string, alternative: any): any {
    if (!search) {
      return value
    }
    if (!value) {
      return ''
    }
    if (!alternative?.length) {
      return ''
    }

    const solution = alternative?.filter((v: any) => {
      if (!v) {
        return false
      }
      return JSON.stringify(v).toLowerCase().indexOf(search.toLowerCase()) > -1
    })

    return solution
  }
}
