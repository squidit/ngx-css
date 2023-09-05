import { Pipe, PipeTransform } from '@angular/core'
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser'

/**
 * A custom Angular pipe for sanitizing and displaying trusted content.
 * This pipe can be used to bypass security and render trusted HTML, styles, scripts, URLs, or resource URLs.
 *
 * @example
 * // In your component template:
 * // Assuming 'htmlContent' is a string containing trusted HTML.
 * <div [innerHTML]="htmlContent | universalSafe:'html'"></div>
 *
 * @param {string} value - The content to sanitize and display.
 * @param {string} type - The type of content to sanitize. Can be 'html', 'style', 'script', 'url', or 'resourceUrl'.
 * @returns {SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl} - The sanitized and trusted content.
 */
@Pipe({
  name: 'universalSafe',
})
export class UniversalSafePipe implements PipeTransform {
  /**
   * Creates an instance of UniversalSafePipe.
   *
   * @param {DomSanitizer} sanitizer - The Angular DOM sanitizer service.
   */
  constructor(protected sanitizer: DomSanitizer) { }

  /**
   * Sanitizes and returns trusted content based on the specified type.
   *
   * @param {string} value - The content to sanitize and display.
   * @param {string} type - The type of content to sanitize. Can be 'html', 'style', 'script', 'url', or 'resourceUrl'.
   * @returns {SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl} - The sanitized and trusted content.
   * @throws {Error} - If an invalid `type` is provided.
   */
  public transform(value?: string, type = 'html'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    if (!value) {
      return ''
    }
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value)
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value)
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value)
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value)
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value)
      default:
        throw new Error(`Invalid Safe sanitizer: ${type}`)
    }
  }
}
