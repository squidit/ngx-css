import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'docs'
  modal = false
  overlay = false

  onScroll() {
    console.log('scroll')
  }
}
