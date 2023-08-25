import { Component, Input } from '@angular/core'

@Component({
  selector: 'sq-loader',
  templateUrl: './sq-loader.component.html',
  styleUrls: ['./sq-loader.component.scss'],
})
export class SqLoaderComponent {
  @Input() size?: 'small' | 'bigger' | 'big' | '' = 'small'
  @Input() customSize?: string
  @Input() borderSize = '0.20em'
  @Input() color = 'var(--pink)'
  @Input() customClass = ''
}
