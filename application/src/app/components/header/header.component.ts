import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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
