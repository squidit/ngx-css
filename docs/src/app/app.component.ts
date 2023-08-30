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
  date = new Date()

  onScroll() {
    console.log('scroll')
  }
}
