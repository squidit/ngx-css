import { NgModule } from '@angular/core'
import { SqButtonComponent } from './components/sq-button/sq-button.component'
import { CommonModule } from '@angular/common'
import { SqLoaderComponent } from './components/sq-loader/sq-loader.component'

@NgModule({
  declarations: [
    SqButtonComponent,
    SqLoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SqButtonComponent,
    SqLoaderComponent
  ]
})
export class SquidCSSModule { }
