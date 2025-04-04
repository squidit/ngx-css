import { ChangeDetectorRef } from '@angular/core'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
/**
 * Represents a tab component for displaying tabbed content.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/tabs}
 * 
 * @example
 * <sq-tab [title]="'Tab Title'" (whenOpen)="handleTabOpen()">
 * <!-- Content Here -->
 * </sq-tab>
 *
 */
@Component({
  selector: 'sq-tab',
  templateUrl: './sq-tab.component.html',
  styleUrls: ['./sq-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqTabComponent {
  /**
   * Flag to indicate if the tab is active (open).
   */
  @Input() set active(value: boolean) {
    this._active = value
    if (value) {
      this.cdr.markForCheck()
    }
  }
  get active(): boolean {
    return this._active
  }
  private _active = false

  /**
   * The title displayed on the tab.
   */
  @Input() title = ''

  /**
   * The text color of the tab title.
   */
  @Input() textColor = 'black'

  /**
   * The background color of the tab.
   */
  @Input() color = 'white'

  /**
   * The border color of the tab.
   */
  @Input() borderColor = 'transparent'

  /**
   * Flag to indicate if the tab is disabled.
   */
  @Input() disabled?: boolean

  /**
   * Flag to indicate if the tab is in a loading state.
   */
  @Input() loading?: boolean

  /**
   * The name or identifier of the tab.
   */
  @Input() tabName = ''

  /**
   * Flag to hide the tab html.
   */
  @Input() set hideHtml(value: boolean) {
    this._hideHtml = value
    this.cdr.markForCheck()
  }
  get hideHtml(): boolean {
    return this._hideHtml
  }
  private _hideHtml = false

  /**
   * Event emitted when the tab is opened.
   */
  @Output() whenOpen: EventEmitter<void> = new EventEmitter()

  constructor(private cdr: ChangeDetectorRef) { }
}