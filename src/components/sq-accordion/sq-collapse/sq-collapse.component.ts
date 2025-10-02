import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ColorsHelper } from '../../../helpers/colors.helper';
import { useMemo } from '../../../helpers/memo.helper';
import { SqLoaderComponent } from '../../sq-loader/sq-loader.component';
import { SqTooltipDirective } from '../../../directives/sq-tooltip/sq-tooltip.directive';

/**
 * Represents the SqCollapseComponent, a collapsible container component with customizable options.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/accordion-collapse}
 *
 * @example
 * <sq-collapse [open]="true" color="blue" (openedEmitter)="onOpened($event)">
 *   <ng-container header>
 *     <div>Header Content</div>
 *   </ng-container>
 *   <div>Body Content</div>
 * </sq-collapse>
 */
@Component({
  selector: 'sq-collapse',
  templateUrl: './sq-collapse.component.html',
  styleUrls: ['./sq-collapse.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, SqLoaderComponent, SqTooltipDirective],
})
export class SqCollapseComponent {
  /**
   * Indicates whether the collapse is initially open.
   */
  @Input() open = false;

  /**
   * Indicates whether the collapse is in a loading state.
   */
  @Input() loading?: boolean;

  /**
   * Indicates whether the collapse is disabled.
   */
  @Input() disabled?: boolean;

  /**
   * Indicates whether just the collapse dropdown button is disabled.
   */
  @Input() collapseButtonDisabled?: boolean;

  /**
   * The tooltip for the collapse button.
   */
  @Input() collapseButtonTooltip?: string;

  /**
   * The color scheme of the collapse component.
   */
  @Input() color = '';

  /**
   * The color of the collapse icons.
   */
  @Input() colorIcons = '';

  /**
   * The background color of the collapse icon.
   */
  @Input() colorBackgroundIcon = '';

  /**
   * The font size of the collapse icon.
   */
  @Input() fontSizeIcon?: string;

  /**
   * The height of the collapse icon.
   */
  @Input() heightIcon?: string;

  /**
   * Custom CSS class to be applied to the collapse component.
   */
  @Input() class = '';

  /**
   * Indicates whether to remove padding from the collapse content.
   */
  @Input() noPadding = false;

  /**
   * Event emitter for when the collapse is opened or closed.
   */
  @Output() openedEmitter: EventEmitter<{
    open: boolean;
    element: HTMLElement | ElementRef<any> | null;
  }> = new EventEmitter();

  /**
   * Reference to the header content template.
   */
  @ContentChild('header')
  headerTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Reference to the element.
   */
  @ViewChild('element') element?: ElementRef;

  /**
   * Reference to the content element.
   */
  @ViewChild('content') content?: ElementRef;

  /**
   * Wrapper body element.
   */
  @ViewChild('wrapper') wrapper?: ElementRef;

  /**
   * Indicates whether the collapse is in the process of opening.
   */
  opening: boolean | string = false;

  /**
   * Indicates whether the mouse is hovering over the header.
   */
  hoverHeader = false;

  /**
   * Indicates whether the mouse is hovering over the collapse icon.
   */
  hoverIcon = false;

  /**
   * Timeout handler to open animation
   */
  timeout!: ReturnType<typeof setTimeout>;

  /**
   * Component Constructor
   * @param colorsHelper - The ColorsHelper instance
   * @param elementRef - The ElementRef instance
   */
  constructor(
    public colorsHelper: ColorsHelper,
    public elementRef: ElementRef
  ) {}

  /**
   * Toggles the state of the collapse component.
   */
  public async toggleCollapse() {
    if (!this.disabled && !this.collapseButtonDisabled && !this.loading && !this.opening) {
      this.opening = this.wrapper?.nativeElement?.clientHeight + 'px';
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.opening = false;
        this.open = !this.open;
      }, 500);
    }
  }

  /**
   * Emits an event when the collapse is opened or closed.
   * @param element - The HTML element associated with the collapse.
   */
  emit(element: HTMLElement): void {
    this.openedEmitter.emit({
      open: !this.open,
      element,
    });
  }

  /**
   * Sets the hover state for a given color.
   * @param color - The color for which to set the hover state.
   * @returns The modified color.
   */
  setHover = useMemo((color: string) => {
    return this.colorsHelper?.lightenDarkenColor(this.colorsHelper?.getCssVariableValue(color), -25);
  });
}
