import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core'
import { ColorsHelper } from '../../helpers/colors.helper'

@Component({
  selector: 'collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss'],
})
export class CollapseComponent {
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

  @Output() openedEmitter: EventEmitter<any> = new EventEmitter()

  @ContentChild('header', { static: true })
  headerTemplate: TemplateRef<any>

  @ViewChild('element', { static: true }) element: ElementRef
  @ViewChild('content', { static: true }) content: ElementRef

  opening: any = false
  timeOut: any
  hoverHeder = false
  hoverIcon = false

  constructor(public colorsHelper: ColorsHelper) {}

  public toggleCollapse(): void {
    const { disabled, loading } = this
    if (!disabled && !loading && !this.opening) {
      this.opening = this.content.nativeElement.children[0].offsetHeight + 'px'
      this.timeOut = clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.opening = false
        this.open = !this.open
      }, 500)
    }
  }

  emit(element: any): void {
    this.openedEmitter.emit({
      open: !this.open,
      element,
    })
  }

  getHeight() {
    if (this.opening) {
      return this.opening
    } else if (this.open && !this.disabled && !this.loading) {
      return 'auto'
    } else {
      return '0'
    }
  }

  setHover(color: string): string {
    return this.colorsHelper?.lightenDarkenColor(this.colorsHelper?.getCssVariableValue(color), -25)
  }
}
