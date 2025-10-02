import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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
 */
@Component({
  selector: 'sq-tab',
  templateUrl: './sq-tab.component.html',
  styleUrls: ['./sq-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SqTabComponent {
  /**
   * Internal property to track the active state of the tab.
   */
  private _active = false;

  /**
   * Sets or gets the active state of the tab.
   * If set to `true`, triggers change detection.
   */
  @Input() set active(value: boolean) {
    this._active = value;
    if (value) {
      this.cdr.markForCheck();
    }
  }
  get active(): boolean {
    return this._active;
  }

  /**
   * The title displayed on the tab.
   */
  @Input() title = '';

  /**
   * The text color of the tab title.
   */
  @Input() textColor = 'black';

  /**
   * The background color of the tab.
   */
  @Input() color = 'white';

  /**
   * The border color of the tab.
   */
  @Input() borderColor = 'transparent';

  /**
   * Flag to indicate if the tab is disabled.
   */
  @Input() disabled?: boolean;

  /**
   * Flag to indicate if the tab is in a loading state.
   */
  @Input() loading?: boolean;

  /**
   * The name or identifier of the tab.
   */
  @Input() tabName = '';

  /**
   * Internal property to track if the tab HTML should be hidden.
   */
  private _hideHtml = false;

  /**
   * Sets or gets whether the tab HTML should be hidden.
   * Triggers change detection when updated.
   */
  @Input() set hideHtml(value: boolean) {
    this._hideHtml = value;
    this.cdr.markForCheck();
  }
  get hideHtml(): boolean {
    return this._hideHtml;
  }

  /**
   * Event emitted when the tab is opened.
   */
  @Output() whenOpen: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of SqTabComponent.
   * @param cdr - Angular's ChangeDetectorRef for manual change detection control.
   */
  constructor(private cdr: ChangeDetectorRef) {}
}
