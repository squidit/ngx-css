import { Pipe, PipeTransform } from '@angular/core'

/**
 * A custom Angular pipe for filtering an array of objects based on a search string.
 *
 * @example
 * // In your component template:
 * // Assuming 'items' is an array of objects and 'searchTerm' is a string.
 * <ul>
 *   <li *ngFor="let item of items | search: searchTerm">{{ item.name }}</li>
 * </ul>
 *
 * @param {any[]} value - The array of objects to filter.
 * @param {string} search - The search string to filter by.
 * @returns {any[]} - The filtered array of objects.
 */

@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  /**
   * Transforms an array of objects by filtering based on a search string.
   *
   * @param {any[]} value - The array of objects to filter.
   * @param {string} search - The search string to filter by.
   * @param {any[]} alternativeList - If you want to search in another array, send this.
   * @param {boolean} fromChildren - Indicate when value is from a children of the main array.
   * @returns {any[]} - The filtered array of objects.
   */
  transform(value: any, search: string, fromChildren?: boolean, alternativeList?: any): any {
    if (!search) {
      return value
    }
    if (!value) {
      return ''
    }

    let solution

    if (alternativeList?.length) {
      solution = alternativeList?.filter((v: any) => {
        if (!v) {
          return false
        }
        return JSON.stringify(v).toLowerCase().indexOf(search.toLowerCase()) > -1
      })
    } else {
      solution = value?.filter((v: any) => {
        if (!v) {
          return false
        }
        return JSON.stringify(v).toLowerCase().indexOf(search.toLowerCase()) > -1
      })
    }

    if (fromChildren && !solution?.length && value?.length) {
      return value
    }

    return solution
  }
}
