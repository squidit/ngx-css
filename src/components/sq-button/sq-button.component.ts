import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core'
import { ColorsHelper } from 'src/helpers/colors.helper'
import { useMemo } from 'src/helpers/memo.helper'

@Component({
  selector: 'sq-button',
  templateUrl: './sq-button.component.html',
  styleUrls: ['./sq-button.component.scss'],
})
export class SqButtonComponent {
  @Input() type = 'button'
  @Input() color = 'var(--pink)'
  @Input() textColor = 'var(--white-html)'
  @Input() borderColor = 'transparent'
  @Input() borderStyle = 'solid'
  @Input() textTransform?: string = 'capitalize'
  @Input() borderWidth = '1px'
  @Input() borderRadius = '5px'
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
