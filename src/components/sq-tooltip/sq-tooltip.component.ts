import { Component, Input } from '@angular/core'

@Component({
  selector: 'sq-tooltip',
  templateUrl: './sq-tooltip.component.html',
  styleUrls: ['./sq-tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() color?: string
  @Input() inverted?: boolean
  @Input() icon?: string
  @Input() placement = 'center top'
  @Input() message = ''
  @Input() tooltipClass = ''
  @Input() container = 'body'
  @Input() textAlign = 'text-center'
  @Input() fontSize = '1rem'
}
