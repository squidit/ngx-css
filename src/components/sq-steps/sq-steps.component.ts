import { Component, EventEmitter, Input, Output } from '@angular/core'

/**
 * Represents a step in a sequence of steps.
 *
 * @export
 * @interface Step
 */
export interface Step {
  /**
   * Additional information or a tip related to the step.
   */
  tip?: string;

  /**
   * The status of the step (e.g., "completed", "active", "disabled").
   */
  status: string;
}

/**
 * Represents a component for displaying a sequence of steps.
 *
 * @example
 * <sq-steps [active]="0" [steps]="stepArray"></sq-steps>
 *
 */
@Component({
  selector: 'sq-steps',
  templateUrl: './sq-steps.component.html',
  styleUrls: ['./sq-steps.component.scss'],
})
export class SqStepsComponent {
  /**
   * The color theme for the steps component.
   */
  @Input() color = 'var(--pink)'

  /**
   * Flag to enable or disable clicking on steps.
   */
  @Input() click = false

  /**
   * The index of the currently active step.
   */
  @Input() active = 0

  /**
   * An array of step objects representing the steps in the sequence.
   */
  @Input() steps: Step[] = []

  /**
   * Event emitted when a step is clicked.
   */
  @Output() emitClick: EventEmitter<{ step?: Step, i: number }> = new EventEmitter()

  /**
   * Handles the click event on a step.
   * Emits the `emitClick` event with information about the clicked step and its index.
   *
   * @param {number} index - The index of the clicked step.
   */
  handleClick(index: number): void {
    if (this.click && index >= 0 && index < this.steps.length) {
      this.emitClick.emit({ step: this.steps[index], i: index })
    }
  }
}