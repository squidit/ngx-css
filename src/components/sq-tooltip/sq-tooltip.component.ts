import { Component, Input } from '@angular/core'

@Component({
  selector: 'sq-tooltip',
  templateUrl: './sq-tooltip.component.html',
  styleUrls: ['./sq-tooltip.component.scss'],
})
export class SqTooltipComponent {
  @Input() color = ''
  @Input() icon = ''
  @Input() placement = 'center top'
  @Input() message = ''
  @Input() tooltipClass = ''
  @Input() textAlign = 'text-center'
  @Input() fontSize = '1rem'
}
