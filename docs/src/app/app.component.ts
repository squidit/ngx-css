import { Component } from '@angular/core'

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

  onScroll() {
    console.log('scroll')
  }
}
