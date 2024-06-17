import { Component, EventEmitter, Input, Output } from '@angular/core'

/**
 * Represents the SqClickableIconComponent, a customizable clickable icon component.
 *
 * @example
 * <sq-clickable-icon (emitClick)="onClick($event)">
 * </sq-clickable-icon>
 */
@Component({
  selector: 'sq-clickable-icon',
  templateUrl: './sq-clickable-icon.component.html',
  styleUrls: ['./sq-clickable-icon.component.scss'],
})
export class SqClickableIconComponent {
  /**
   * The clickable icon.
   */
  @Input() icon = ''

  /**
   * The clickable icon size.
   */
  @Input() size = '14px'

  /**
   * The clickable icon color.
   */
  @Input() color = ''

  /**
   * Event emitter for when the icon is clicked.
   */
  @Output() emitClick: EventEmitter<MouseEvent> = new EventEmitter()

  /**
   * Executes a function when the icon is clicked.
   * @param event - The MouseEvent associated with the click event.
   */
  executeFunction(event: MouseEvent) {
    this.emitClick.emit(event)
  }

}
