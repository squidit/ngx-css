import { Component, EventEmitter, Input, Output } from '@angular/core'

interface Step {
  tip?: string
  status: string
}

@Component({
  selector: 'sq-steps',
  templateUrl: './sq-steps.component.html',
  styleUrls: ['./sq-steps.component.scss'],
})
export class SqStepsComponent {
  @Input() color = 'var(--pink)'
  @Input() click = false
  @Input() active = 0
  @Input() steps: Step[] = []

  @Output() emitClick: EventEmitter<{ step?: Step, i: number }> = new EventEmitter()
}
