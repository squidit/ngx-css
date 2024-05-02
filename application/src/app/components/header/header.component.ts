import { isPlatformServer, DOCUMENT } from '@angular/common'
import { Component, Inject, InjectionToken, OnInit, PLATFORM_ID } from '@angular/core'


@Component({
  selector: 'main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isServer = isPlatformServer(this.platformId)

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<Object>, @Inject(DOCUMENT) private _doc: Document) {}

  theme = !this.isServer && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'

  ngOnInit() {
    this.theme = !this.isServer && localStorage.getItem('theme') || this.theme
    const html = this._doc.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    const html = document.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
    localStorage.setItem('theme', this.theme)
  }
}
