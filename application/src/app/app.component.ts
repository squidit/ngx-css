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
    const html = document.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    const html = document.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
    localStorage.setItem('theme', this.theme)
  }
}
