import { DOCUMENT, isPlatformServer } from '@angular/common'
import { Component, Inject, InjectionToken, OnInit, PLATFORM_ID } from '@angular/core'
import { GetWindow } from '@squidit/ngx-css'

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
  ) { }

  theme = this.getWindow.window()?.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'

  ngOnInit() {
    this.theme = localStorage?.getItem('theme') || this.theme
    const html = this.document.getElementsByTagName('html')[0]
    html.classList.value = `${this.theme}`
  }

  log(event: string) {
    console.log(event)
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    if (!this.isServer) {
      const html = this.document.getElementsByTagName('html')[0]
      html.classList.value = `${this.theme}`
      localStorage.setItem('theme', this.theme)
    }
  }
}
