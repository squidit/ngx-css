import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ColorsHelper } from '../../helpers/colors.helper'
import { useMemo } from '../../helpers/memo.helper'

@Component({
  selector: 'sq-tag',
  templateUrl: './sq-tag.component.html',
  styleUrls: ['./sq-tag.component.scss']
})
export class SqTagsComponent {
  @Input() customClass = ''
  @Input() rounded = false
  @Input() color = ''
  @Input() backgroundColor = ''
  @Input() readonly = false
  @Input() disabled = false

  @Output() emitClick: EventEmitter<void> = new EventEmitter<void>()

  constructor(public colorsHelper: ColorsHelper) {
  }

  validatePresetColors() {
    return !!this.colorsHelper?.getCssVariableValue(this.color)
  }

  getColor = useMemo(() => {
    if (this.validatePresetColors()) {
      return ''
    }
    return this.color
  })

  getBackgroundColor = useMemo(() => {
    if (this.validatePresetColors()) {
      return ''
    }
    return this.backgroundColor
  })

  handleClick() {
    if (this.readonly || this.disabled) {
      return
    }
    this.emitClick.emit()
  }
}