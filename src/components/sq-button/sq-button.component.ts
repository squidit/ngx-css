import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core'
import { ColorsHelper } from '../../helpers/colors.helper'
import { useMemo } from '../../helpers/memo.helper'

@Component({
  selector: 'sq-button',
  templateUrl: './sq-button.component.html',
  styleUrls: ['./sq-button.component.scss'],
})
export class SqButtonComponent {
  @Input() type = 'button'
  @Input() color = 'pink'
  @Input() textColor = ''
  @Input() borderColor = ''
  @Input() borderStyle = ''
  @Input() textTransform = ''
  @Input() borderWidth = ''
  @Input() borderRadius = ''
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
  @Input() fontSize?: string
  @Input() loading?: boolean
  @Input() disabled?: boolean
  @Input() block?: boolean
  @Input() noPadding?: boolean
  @Input() id?: string
  @Input() buttonAsLink?: boolean
  @Input() hideOnLoading?: boolean
  @Input() invertedHover = false
  @Input() noUnderline?: boolean
  @Input() boxShadow?: string
  @Input() width?: string

  @Output() emitClick: EventEmitter<MouseEvent> = new EventEmitter()

  nativeElement: ElementRef
  hover = false

  constructor(public element: ElementRef, public colorsHelper: ColorsHelper) {
    this.nativeElement = element.nativeElement
  }

  validatePresetColors() {
    return !!this.colorsHelper?.getCssVariableValue(this.color)
  }

  doHoverOnText() {
    if (this.hover) {
      return this.setHoverText()
    }
    return this.textColor
  }

  doHoverOnBackground() {
    if (this.hover) {
      return this.setHoverBg()
    }
    return this.color
  }

  doHoverOnBorder() {
    if (this.hover) {
      return this.setHover(this.borderColor || this.textColor || '')
    }
    return this.borderColor || this.textColor || ''
  }

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

  setHover = useMemo((color: string) => {
    return this.colorsHelper?.lightenDarkenColor(this.colorsHelper?.getCssVariableValue(color), -25)
  })

  setHoverBg = useMemo(() => {
    if (this.invertedHover) {
      return this.setHover(this.textColor || '')
    }
    return this.setHover(this.color)
  })

  setHoverText = useMemo(() => {
    if (this.invertedHover) {
      return this.setHover(this.color !== 'transparent' ? this.color : 'var(--white-html)')
    }
    return this.setHover(this.textColor !== 'transparent' ? this.textColor || '' : 'var(--white-html)')
  })

  executeFunction(event: MouseEvent) {
    const { loading, disabled } = this
    if (!loading && !disabled) {
      this.emitClick.emit(event)
    }
  }
}
