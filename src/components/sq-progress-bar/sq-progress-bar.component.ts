import { Component, Input } from '@angular/core'
import { useMemo } from '../../helpers/memo.helper'

@Component({
  selector: 'sq-progress-bar',
  templateUrl: './sq-progress-bar.component.html',
  styleUrls: ['./sq-progress-bar.component.scss'],
})
export class SqProgressBarComponent {
  @Input() color = 'black'
  @Input() hasLabel = false
  @Input() value: string | number = 0
  @Input() height = '1rem'
  @Input() striped = true
  @Input() animated = true

  roundValue = useMemo((value: string | number) => {
    return Math.round(Number(value))
  })
}
