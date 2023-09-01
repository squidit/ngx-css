import { Component, Input } from '@angular/core'

/**
 * Represents the SqLoaderComponent which displays a loading spinner with customizable options.
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
  styleUrls: ['./sq-loader.component.scss']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class Loader {
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
   * @default 'var(--pink)'
   * @example '#ff9900'
   */
  @Input() color = 'var(--pink)'

  /**
   * Custom CSS class to be applied to the loading spinner element.
   */
  @Input() customClass = ''
}

/**
 * @ignore
 * 
 */
@Component({
  selector: 'sq-loader', // Use a different selector for documentation
  templateUrl: './sq-loader.component.html',
  styleUrls: ['./sq-loader.component.scss'],
})
export class SqLoaderComponent extends Loader { }
