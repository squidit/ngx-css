import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ColorsHelper } from '../../helpers/colors.helper'
import { useMemo } from '../../helpers/memo.helper'

/**
 * Represents a tag component with customizable appearance and behavior.
 * 
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/tag}
 * 
 *  <div class=' my-3 tag-box'>
 *    Tag Content
 *  </div>
 * 
 * @example
 * <sq-tag>Tag Content</sq-tag>
 */
@Component({
  selector: 'sq-tag',
  templateUrl: './sq-tag.component.html',
  styleUrls: ['./sq-tag.component.scss']
})
export class SqTagComponent {
  /**
   * Additional CSS classes for styling the tag.
   */
  @Input() customClass = ''

  /**
   * Flag to round the corners of the tag.
   */
  @Input() rounded = false

  /**
   * The text color of the tag.
   */
  @Input() color = ''

  /**
   * The background color of the tag.
   */
  @Input() backgroundColor = ''

  /**
   * Flag to make the tag readonly.
   */
  @Input() readonly = false

  /**
   * Flag to disable the tag.
   */
  @Input() disabled = false

  /**
   * Event emitted when the tag is clicked.
   */
  @Output() emitClick: EventEmitter<void> = new EventEmitter<void>()

  /**
 * Constructor for the SqButtonComponent class.
 * @param colorsHelper - The ColorsHelper service for color manipulation.
 */
  constructor(
    public colorsHelper: ColorsHelper
  ) {
  }

  /**
   * Validates whether the specified color is a preset color.
   *
   * @returns {boolean} True if the color is a valid preset color, false otherwise.
   */
  validatePresetColors(): boolean {
    return !!this.colorsHelper?.getCssVariableValue(this.color)
  }

  /**
   * Retrieves the computed text color for the tag.
   *
   * @returns {string} The computed text color.
   */
  getColor = useMemo(() => {
    if (this.validatePresetColors()) {
      return ''
    }
    return this.color
  })

  /**
   * Retrieves the computed background color for the tag.
   *
   * @returns {string} The computed background color.
   */
  getBackgroundColor = useMemo(() => {
    if (this.validatePresetColors()) {
      return ''
    }
    return this.backgroundColor
  })

  /**
   * Handles the click event on the tag.
   * Emits the `emitClick` event if the tag is not readonly or disabled.
   */
  handleClick(): void {
    if (this.readonly || this.disabled) {
      return
    }
    this.emitClick.emit()
  }
}