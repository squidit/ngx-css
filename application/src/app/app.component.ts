import { DOCUMENT, isPlatformServer } from '@angular/common'
import { Component, Inject, InjectionToken, OnInit, PLATFORM_ID } from '@angular/core'
import { GetWindow } from 'src/helpers/window.helper'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isServer = isPlatformServer(this.platformId)

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
  @Inject(DOCUMENT) private document: Document,
  public getWindow: GetWindow
) {}

theme = !this.isServer && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'

ngOnInit() {
    this.theme = !this.isServer && localStorage.getItem('theme') || this.theme
    const html = this.document.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    const html = this.document.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
    localStorage.setItem('theme', this.theme)
  }
}
