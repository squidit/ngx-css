import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core'
import { ColorsHelper } from '../../../helpers/colors.helper'
import { useMemo } from '../../../helpers/memo.helper'

@Component({
  selector: 'sq-collapse',
  templateUrl: './sq-collapse.component.html',
  styleUrls: ['./sq-collapse.component.scss'],
})
export class SqCollapseComponent {
  @Input() header?: boolean
  @Input() open = false
  @Input() loading?: boolean
  @Input() disabled?: boolean
  @Input() color = 'cian'
  @Input() colorIcons = 'black'
  @Input() colorBackgroundIcon = 'transparent'
  @Input() fontSizeIcon?: string
  @Input() heightIcon?: string
  @Input() class = ''
  @Input() noPadding = false

  @Output() openedEmitter: EventEmitter<{
    open: boolean
    element: HTMLElement
  }> = new EventEmitter()

  @ContentChild('header')
  headerTemplate: TemplateRef<HTMLElement> | null = null

  @ViewChild('element') element?: ElementRef
  @ViewChild('content') content?: ElementRef

  opening: boolean | string = false
  timeOut?: ReturnType<typeof setTimeout>
  hoverHeder = false
  hoverIcon = false

  constructor(public colorsHelper: ColorsHelper) { }

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

  emit(element: HTMLElement): void {
    this.openedEmitter.emit({
      open: !this.open,
      element,
    })
  }

  getHeight = useMemo((opening: string | boolean) => {
    if (opening) {
      return opening
    } else if (this.open && !this.disabled && !this.loading) {
      return 'auto'
    } else {
      return '0'
    }
  })

  setHover = useMemo((color: string) => {
    return this.colorsHelper?.lightenDarkenColor(this.colorsHelper?.getCssVariableValue(color), -25)
  })
}
