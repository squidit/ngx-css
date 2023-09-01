import { Component, EventEmitter, Input, Output } from '@angular/core'
/**
 * Represents a tab component for displaying tabbed content.
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
})
export class SqTabComponent {
  /**
   * Flag to indicate if the tab is active (open).
   */
  @Input() active = false

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
   * Event emitted when the tab is opened.
   */
  @Output() whenOpen: EventEmitter<void> = new EventEmitter()
}