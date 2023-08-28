import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'sq-tab',
  templateUrl: './sq-tab.component.html',
  styleUrls: ['./sq-tab.component.scss'],
})
export class SqTabComponent {
  @Input() active = false
  @Input() title = ''
  @Input() textColor = 'black'
  @Input() color = 'white'
  @Input() borderColor = 'transparent'
  @Input() disabled?: boolean
  @Input() loading?: boolean
  @Input() tabName = ''
  @Output() whenOpen: EventEmitter<void> = new EventEmitter()
}

