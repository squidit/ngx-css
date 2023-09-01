import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core'
import { ColorsHelper } from '../../../helpers/colors.helper'
import { useMemo } from '../../../helpers/memo.helper'

/**
 * Represents the SqCollapseComponent, a collapsible container component with customizable options.
 *
 * @example
 * <sq-collapse open="true" color="blue" (openedEmitter)="onOpened($event)">
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
})
export class SqCollapseComponent {
  /**
   * Indicates whether the collapse is initially open.
   */
  @Input() open = false

  /**
   * Indicates whether the collapse is in a loading state.
   */
  @Input() loading?: boolean

  /**
   * Indicates whether the collapse is disabled.
   */
  @Input() disabled?: boolean

  /**
   * The color scheme of the collapse component.
   */
  @Input() color = ''

  /**
   * The color of the collapse icons.
   */
  @Input() colorIcons = ''

  /**
   * The background color of the collapse icon.
   */
  @Input() colorBackgroundIcon = ''

  /**
   * The font size of the collapse icon.
   */
  @Input() fontSizeIcon?: string

  /**
   * The height of the collapse icon.
   */
  @Input() heightIcon?: string

  /**
   * Custom CSS class to be applied to the collapse component.
   */
  @Input() class = ''

  /**
   * Indicates whether to remove padding from the collapse content.
   */
  @Input() noPadding = false

  /**
   * Event emitter for when the collapse is opened or closed.
   */
  @Output() openedEmitter: EventEmitter<{
    open: boolean;
    element: HTMLElement;
  }> = new EventEmitter()

  /**
   * Reference to the header content template.
   */
  @ContentChild('header')
  headerTemplate: TemplateRef<HTMLElement> | null = null

  /**
   * Reference to the element.
   */
  @ViewChild('element') element?: ElementRef

  /**
   * Reference to the content element.
   */
  @ViewChild('content') content?: ElementRef

  /**
   * Indicates whether the collapse is in the process of opening.
   */
  opening: boolean | string = false

  /**
   * Timeout for controlling the animation when opening/closing the collapse.
   */
  timeOut?: ReturnType<typeof setTimeout>

  /**
   * Indicates whether the mouse is hovering over the header.
   */
  hoverHeader = false

  /**
   * Indicates whether the mouse is hovering over the collapse icon.
   */
  hoverIcon = false

  /**
   * Component Constructor
   * @param colorsHelper - The ColorsHelper instance
   */
  constructor(public colorsHelper: ColorsHelper) { }

  /**
   * Toggles the state of the collapse component.
   */
  public toggleCollapse(): void {
    const { disabled, loading } = this
    if (!disabled && !loading && !this.opening) {
      this.opening = this.content?.nativeElement?.clientHeight + 'px'
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.opening = false
        this.open = !this.open
      }, 500)
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
    })
  }

  /**
   * Gets the height of the collapse based on its state.
   * @param opening - The opening state of the collapse.
   * @returns The height as a string (e.g., 'auto' or '0').
   */
  getHeight = useMemo((opening: string | boolean) => {
    if (opening) {
      return opening
    } else if (this.open && !this.disabled && !this.loading) {
      return 'auto'
    } else {
      return '0'
    }
  })

  /**
   * Sets the hover state for a given color.
   * @param color - The color for which to set the hover state.
   * @returns The modified color.
   */
  setHover = useMemo((color: string) => {
    return this.colorsHelper?.lightenDarkenColor(this.colorsHelper?.getCssVariableValue(color), -25)
  })
}
