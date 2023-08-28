import { NgModule } from '@angular/core'
import { SqButtonComponent } from './components/sq-button/sq-button.component'
import { CommonModule } from '@angular/common'
import { SqLoaderComponent } from './components/sq-loader/sq-loader.component'
import { SqProgressBarComponent } from './components/sq-progress-bar/sq-progress-bar.component'
import { SqStepsComponent } from './components/sq-steps/sq-steps.component'
import { SqTooltipDirective } from './directives/sq-tooltip/sq-tooltip.directive'
import { TooltipComponent } from './components/sq-tooltip/sq-tooltip.component'
import { UniversalSafePipe } from './pipes/universal-safe/universal-safe.pipe'
import { ThousandSuffixesPipe } from './pipes/thousands/thousands.pipe'
import { SqTabComponent } from './components/sq-tabs/sq-tab/sq-tab.component'
import { SqTabsComponent } from './components/sq-tabs/sq-tabs.component'
import { SqInfinityComponent } from './components/sq-infinity-scroll/sq-infinity-scroll.component'

@NgModule({
  declarations: [
    SqButtonComponent,
    SqLoaderComponent,
    SqProgressBarComponent,
    SqStepsComponent,
    SqTooltipDirective,
    TooltipComponent,
    UniversalSafePipe,
    ThousandSuffixesPipe,
    SqTabComponent,
    SqTabsComponent,
    SqInfinityComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SqButtonComponent,
    SqLoaderComponent,
    SqProgressBarComponent,
    SqStepsComponent,
    SqTooltipDirective,
    TooltipComponent,
    UniversalSafePipe,
    ThousandSuffixesPipe,
    SqTabComponent,
    SqTabsComponent,
    SqInfinityComponent
  ]
})
export class SquidCSSModule { }
