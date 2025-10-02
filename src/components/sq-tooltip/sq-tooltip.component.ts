import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { SqTooltipDirective } from '../../directives/sq-tooltip/sq-tooltip.directive';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
/**
 * Represents a tooltip component for displaying informative messages.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/tooltip}
 *
 * @example
 * <sq-tooltip placement='center top' message='This is a tooltip message.'></sq-tooltip>
 *
 */
@Component({
  selector: 'sq-tooltip',
  templateUrl: './sq-tooltip.component.html',
  styleUrls: ['./sq-tooltip.component.scss'],
  standalone: true,
  imports: [NgStyle, SqTooltipDirective, UniversalSafePipe],
})
export class SqTooltipComponent {
  /**
   * The background color of the tooltip.
   */
  @Input() color = '';

  /**
   * The name of the icon to display in the tooltip.
   */
  @Input() icon = '';

  /**
   * The placement of the tooltip (e.g., 'center top').
   * @see {@link https://css.squidit.com.br/components/tooltip}
   */
  @Input() placement = 'center top';

  /**
   * The message to display in the tooltip.
   */
  @Input() message = '';

  /**
   * Additional CSS classes for styling the tooltip.
   */
  @Input() tooltipClass = '';

  /**
   * The text alignment within the tooltip.
   */
  @Input() textAlign = 'text-center';

  /**
   * The font size of the tooltip content.
   */
  @Input() fontSize = '1rem';

  /**
   * The tooltip trigger
   * Possible values: 'hover' or 'click'.
   */
  @Input() trigger: 'hover' | 'click' = 'hover';
}
