import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CountdownComponent, CountdownEvent } from 'ngx-countdown'

/**
 * Interface for the return event os emitters.
 * @interface
 */
interface returnEvent {
  /**
   * The time left in the countdown.
   */
  left: number
}

/**
 * Represents the SqCountdownComponent, a component for countdown.
 * 
 * @example
 * <sq-countdown [leftTime]="10"></sq-countdown>
 */
@Component({
  selector: 'sq-countdown',
  templateUrl: './sq-countdown.component.html',
  styleUrls: ['./sq-countdown.component.scss'],
  standalone: true,
  imports: [CountdownComponent],
})
export class SqCountdownComponent {
  /**
   * Starting time to countdown (e.g., 5.5, 30) (Unit: seconds).
   */
  @Input() leftTime = 10

  /**
   * Formats a date value, pls refer to [Accepted patterns](https://angular.io/api/common/DatePipe#usage-notes).
   */
  @Input() format?: string = 'mm:ss'

  /**
   * Should be trigger type `notify` event on the x second. When values is `0` will be trigger every time.
   */
  @Input() notify?: number[] | number

  /**
   * Event emitter for when the countdown starts.
   */
  @Output() startEmitter: EventEmitter<returnEvent> = new EventEmitter()

  /**
   * Event emitter for when the count reaches the input notify times.
   */
  @Output() notifyEmitter: EventEmitter<returnEvent> = new EventEmitter()

  /**
   * Event emitter for when the countdown ends.
   */
  @Output() doneEmitter: EventEmitter<returnEvent> = new EventEmitter()

  /**
   * Map the CountdownEvents to emit startEmitter, notifyEmitter or doneEmitter.
   * @param event - The event associated with the CountdownEvents.
   */
  eventMap(event: CountdownEvent) {
    const action = event.action as "start" | "notify" | "done"
    if (action && this[`${action}Emitter`]) {
      const returnEvent: returnEvent = {
        left: event.left
      }
      this[`${action}Emitter`].emit(returnEvent)
    }
  }
}