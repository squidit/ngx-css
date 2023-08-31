import { Component } from '@angular/core'
import { Option, OptionMulti } from '@squidit/ngx-css'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = ''
  modal = false
  overlay = false
  date = '2023-08-30T14:24:08.292Z'
  val = '95'
  valToMask = ''
  option?: Option
  multiOption?: OptionMulti[] = []
  multiOptions: OptionMulti[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2', children: [{ value: '2.1', label: 'Option 2.1' }, { value: '2.2', label: 'Option 2.2' }] },
    { value: '3', label: 'Option 3' },
  ]

  onScroll() {
    console.log('scroll')
  }
}
