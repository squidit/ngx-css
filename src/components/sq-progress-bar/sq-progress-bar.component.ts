import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { useMemo } from '../../helpers/memo.helper';

/**
 * Represents a progress bar component for displaying progress visually.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/progress-bar}
 *
 * <div class="progress my-3">
 *  <div
 *    class="progress-bar background-dashed animate-bar"
 *    role="progressbar"
 *    aria-valuemin="0"
 *    aria-valuemax="100"
 *  ></div>
 * </div>
 *
 * @example
 * <sq-progress-bar [value]="50" [striped]="true"></sq-progress-bar>
 *
 */
@Component({
  selector: 'sq-progress-bar',
  templateUrl: './sq-progress-bar.component.html',
  styleUrls: ['./sq-progress-bar.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle],
})
export class SqProgressBarComponent {
  /**
   * The color of the progress bar.
   */
  @Input() color = 'black';

  /**
   * Indicates whether to display a label on the progress bar.
   */
  @Input() hasLabel = false;

  /**
   * The value of the progress bar (can be a string or number).
   */
  @Input() value: string | number = 0;

  /**
   * The height of the progress bar.
   */
  @Input() height = '1rem';

  /**
   * Indicates whether to display stripes on the progress bar.
   */
  @Input() striped = true;

  /**
   * Indicates whether the progress bar should have an animation.
   */
  @Input() animated = false;

  /**
   * The rounded value of the progress (rounded to the nearest integer).
   */
  roundValue = useMemo((value: string | number) => {
    return Math.round(Number(value));
  });
}
