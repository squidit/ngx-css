import { Component, Input } from '@angular/core'

/**
 * Represents the SqLoaderComponent which displays a loading spinner with customizable options.
 * 
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/loader}
 * 
 * <br>
 * <div class="loader mb-3" role="status">
 *   <span class="visually-hidden">Loading...</span>
 * </div>
 * 
 * @example
 * <sq-loader size="small" color="var(--blue)" customClass="custom-spinner"></sq-loader>
 *
 * @example
 * <sq-loader size="bigger" customSize="30px" borderSize="0.15em" color="#ff9900"></sq-loader>
 */
@Component({
  selector: 'sq-loader',
  templateUrl: './sq-loader.component.html',
  styleUrls: ['./sq-loader.component.scss'],
})
export class SqLoaderComponent {
  /**
   * The size of the loading spinner.
   * @default 'small'
   */
  @Input() size?: 'small' | 'bigger' | 'big' | '' = 'small'

  /**
   * Custom size of the loading spinner (apply width and height style rules).
   * @example '30px'
   */
  @Input() customSize?: string

  /**
   * The border size of the loading spinner.
   * @default '0.20em'
   */
  @Input() borderSize = '0.20em'

  /**
   * The color of the loading spinner.
   * @default 'var(--primary_color)'
   * @example '#ff9900'
   */
  @Input() color = 'var(--primary_color)'

  /**
   * Custom CSS class to be applied to the loading spinner element.
   */
  @Input() customClass = ''
}

