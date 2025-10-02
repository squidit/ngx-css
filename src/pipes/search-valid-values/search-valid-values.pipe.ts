import { Pipe, PipeTransform } from '@angular/core';

/**
 * A custom Angular channel to filter an array of objects where it returns the searched value or the original value if it does not have the searched result based on a search string.
 *
 * @example
 * // In your component template:
 * // Assuming 'items' is an array of objects and 'searchTerm' is a string.
 * <ul>
 *   <li *ngFor="let item of items | searchValidValues: searchTerm">{{ item.name }}</li>
 * </ul>
 *
 * @param {any[]} value - The array of objects to filter.
 * @param {string} search - The search string to filter by.
 * @returns {any[]} - The filtered array of objects.
 */

@Pipe({ name: 'searchValidValues' })
export class SearchValidValuesPipe implements PipeTransform {
  /**
   * Transforms an array of objects with the searched value or the original value if it does not have the searched result by filtering based on a search string.
   *
   * @param {any[]} value - The array of objects to filter.
   * @param {string} search - The search string to filter by.
   * @returns {any[]} - The filtered array of objects.
   */
  transform(value: any, search: string): any {
    if (!search) {
      return value;
    }
    if (!value) {
      return '';
    }

    const solution = value?.filter((v: any) => {
      if (!v) {
        return false;
      }
      return JSON.stringify(v).toLowerCase().indexOf(search.toLowerCase()) > -1;
    });

    if (!solution?.length) {
      return value;
    }

    return solution;
  }
}
