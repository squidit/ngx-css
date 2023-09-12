import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core'
import { ColorsHelper } from '../../helpers/colors.helper'
import { useMemo } from '../../helpers/memo.helper'

/**
 * Represents the SqButtonComponent, a customizable button component.
 * 
 * Look the link about the component in original framework and the appearance
 * 
 * @see {@link https://css.squidit.com.br/components/button}
 * 
 * <br>
 * <button type="button" class='button button-pink mb-3'>Click Me</button>
 * 
 * @example
 * <sq-button type="button" color="pink" [loading]="false" (emitClick)="onClick($event)">
 *   Click Me
 * </sq-button>
 */
@Component({
  selector: 'sq-button',
  templateUrl: './sq-button.component.html',
  styleUrls: ['./sq-button.component.scss'],
})
export class SqButtonComponent {
  /**
   * The type of the button (e.g., 'button', 'submit', 'reset').
   */
  @Input() type: 'submit' | 'reset' | 'button' = 'button'

  /**
   * The background color of the button.
   */
  @Input() color = 'pink'

  /**
   * The text color of the button.
   */
  @Input() textColor = ''

  /**
   * The border color of the button.
   */
  @Input() borderColor = ''

  /**
   * The border style of the button.
   */
  @Input() borderStyle = ''

  /**
   * The text transformation of the button text (e.g., 'uppercase', 'lowercase').
   */
  @Input() textTransform = ''

  /**
   * The width of the button border.
   */
  @Input() borderWidth = ''

  /**
   * The border radius of the button.
   */
  @Input() borderRadius = ''

  /**
   * The size of the button ('sm', 'md', 'lg', 'xl').
   */
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  /**
   * The font size of the button.
   */
  @Input() fontSize?: string

  /**
   * Indicates whether the button is in a loading state.
   */
  @Input() loading?: boolean

  /**
   * Indicates whether the button is disabled.
   */
  @Input() disabled?: boolean

  /**
   * Indicates whether the button should occupy the full width of its container.
   */
  @Input() block?: boolean

  /**
   * Indicates whether to remove padding from the button.
   */
  @Input() noPadding?: boolean

  /**
   * The ID attribute of the button.
   */
  @Input() id?: string

  /**
   * Indicates whether the button should be styled as a link.
   */
  @Input() buttonAsLink?: boolean

  /**
   * Indicates whether the button should be hidden during the loading state.
   */
  @Input() hideOnLoading?: boolean

  /**
   * Indicates whether the button should have inverted hover colors.
   */
  @Input() invertedHover = false

  /**
   * Indicates whether the button text should have no underline.
   */
  @Input() noUnderline?: boolean

  /**
   * The box shadow of the button.
   */
  @Input() boxShadow?: string

  /**
   * The width of the button.
   */
  @Input() width?: string

  /**
   * Event emitter for when the button is clicked.
   */
  @Output() emitClick: EventEmitter<MouseEvent> = new EventEmitter()

  /**
   * The native element of the button.
   */
  nativeElement: ElementRef

  /**
   * Indicates whether the mouse is hovering over the button.
   */
  hover = false

  /**
   * Constructor for the SqButtonComponent class.
   * @param element - The ElementRef representing the button element.
   * @param colorsHelper - The ColorsHelper service for color manipulation.
   */
  constructor(public element: ElementRef, public colorsHelper: ColorsHelper) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Validates if the preset colors are set correctly.
   * @returns True if the color is set correctly; otherwise, false.
   */
  validatePresetColors() {
    if (!this.color.startsWith('var(--') && !this.color.startsWith('#')) {
      return !!this.colorsHelper?.getCssVariableValue(this.color)
    }
    return false
  }

  /**
   * Determines the text color when hovering.
   * @returns The text color when hovering.
   */
  doHoverOnText() {
    if (this.hover) {
      return this.setHoverText()
    }
    return this.textColor
  }

  /**
   * Determines the background color when hovering.
   * @returns The background color when hovering.
   */
  doHoverOnBackground() {
    if (this.hover) {
      return this.setHoverBg()
    }
    return this.color
  }

  /**
   * Determines the border color when hovering.
   * @returns The border color when hovering.
   */
  doHoverOnBorder() {
    if (this.hover) {
      return this.setHover(this.borderColor || this.textColor || '')
    }
    return this.borderColor || this.textColor || ''
  }

  /**
   * Performs hover-specific actions based on the type (text, background, border).
   * @param type - The type of hover action.
   * @returns The resulting hover action value.
   */
  doHoverAction = useMemo((type: 'text' | 'background' | 'border') => {
    if (this.validatePresetColors()) {
      return ''
    }

    switch (type) {
      case 'text':
        return this.doHoverOnText()
      case 'background':
        return this.doHoverOnBackground()
      case 'border':
        return this.doHoverOnBorder()
      default:
        return ''
    }
  })

  /**
   * Sets the hover color.
   * @param color - The color to apply the hover effect.
   * @returns The color with the hover effect applied.
   */
  setHover(color: string) {
    return this.colorsHelper?.lightenDarkenColor(this.colorsHelper?.getCssVariableValue(color), -25)
  }

  /**
   * Sets the hover background color.
   * @returns The background color with the hover effect applied.
   */
  setHoverBg() {
    if (this.invertedHover) {
      return this.setHover(this.textColor || '')
    }
    return this.setHover(this.color)
  }

  /**
   * Sets the hover text color.
   * @returns The text color with the hover effect applied.
   */
  setHoverText() {
    if (this.invertedHover) {
      return this.setHover(this.color !== 'transparent' ? this.color : 'var(--white-html)')
    }
    return this.setHover(this.textColor !== 'transparent' ? this.textColor || '' : 'var(--white-html)')
  }

  /**
   * Executes a function when the button is clicked.
   * @param event - The MouseEvent associated with the click event.
   */
  executeFunction(event: MouseEvent) {
    const { loading, disabled } = this
    if (!loading && !disabled) {
      this.emitClick.emit(event)
    }
  }
}
