import { Optional, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';

/**
 * A custom Angular pipe for translating text using ngx-translate/core.
 *
 * This pipe allows you to translate a given query using ngx-translate/core's TranslateService.
 * If the TranslateService is available, it fetches the translation for the provided query and optional arguments.
 * If the TranslateService is not available, it returns an empty string.
 *
 * Usage:
 * ```html
 * {{ 'HELLO' | translateInternal | async }}
 * ```
 *
 * @example
 * // In a component's template:
 * <div>{{ 'HELLO' | translateInternal | async }}</div>
 *
 * @param query - The translation key or query to be translated.
 * @param args - Optional arguments that can be passed to the translation service.
 * @returns The translated text if the TranslateService is available; otherwise, an empty string.
 *
 * @see {@link https://github.com/ngx-translate/core|ngx-translate/core}
 */
@Pipe({ name: 'translateInternal', standalone: true })
export class TranslateInternalPipe implements PipeTransform {
  /**
   * Creates a new instance of the TranslateInternalPipe.
   *
   * @param translate - The optional TranslateService instance to be injected. If provided, it will be used for translation.
   */
  constructor(@Optional() private translate: TranslateService) {}

  /**
   * Transforms the input query into its translated version.
   *
   * @param query - The translation key or query to be translated.
   * @param args - Optional arguments that can be passed to the translation service.
   * @returns The translated text if the TranslateService is available; otherwise, an empty string.
   */
  async transform(query: string, ...args: any[]): Promise<string> {
    if (this.translate) {
      return (await lastValueFrom(this.translate.get(query, args))) || '';
    }
    return '';
  }
}
