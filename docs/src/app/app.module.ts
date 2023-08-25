import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SquidCSSModule } from '@squidit/ngx-css'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SquidCSSModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
