import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  theme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'


  ngOnInit() {
    this.theme = localStorage.getItem('theme') || this.theme
    document.body.classList.value = `scrollbar ${this.theme}`
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    document.body.classList.value = `scrollbar ${this.theme}`
    localStorage.setItem('theme', this.theme)
  }
}
