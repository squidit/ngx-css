import { NgModule } from '@angular/core'
import { SqButtonComponent } from './components/sq-button/sq-button.component'
import { CommonModule } from '@angular/common'
import { SqLoaderComponent } from './components/sq-loader/sq-loader.component'
import { SqProgressBarComponent } from './components/sq-progress-bar/sq-progress-bar.component'
import { SqStepsComponent } from './components/sq-steps/sq-steps.component'
import { SqTooltipDirective } from './directives/sq-tooltip/sq-tooltip.directive'
import { SqTooltipComponent } from './components/sq-tooltip/sq-tooltip.component'
import { UniversalSafePipe } from './pipes/universal-safe/universal-safe.pipe'
import { ThousandSuffixesPipe } from './pipes/thousands/thousands.pipe'
import { SqTabComponent } from './components/sq-tabs/sq-tab/sq-tab.component'
import { SqTabsComponent } from './components/sq-tabs/sq-tabs.component'
import { SqInfinityComponent } from './components/sq-infinity-scroll/sq-infinity-scroll.component'
import { SqOverlayComponent } from './components/sq-overlay/sq-overlay.component'
import { SqModalComponent } from './components/sq-modal/sq-modal.component'
import { SqCollapseComponent } from './components/sq-accordion/sq-collapse/sq-collapse.component'
import { SqPaginationComponent } from './components/sq-pagination/sq-pagination.component'
import { SqTagsComponent } from './components/sq-tag/sq-tag.component'
import { SqAccordionComponent } from './components/sq-accordion/sq-accordion.component'
import { SqTextAreaComponent } from './components/sq-textarea/sq-textarea.component'
import { FormsModule } from '@angular/forms'
import { SqSelectComponent } from './components/sq-select/sq-select.component'
import { SqSelectorComponent } from './components/sq-selector/sq-selector.component'
import { SqInputComponent } from './components/sq-input/sq-input.component'
import { SqInputDateComponent } from './components/sq-input-date/sq-input-date.component'
import { SqInputRangeComponent } from './components/sq-input-range/sq-input-range.component'
import { SqInputFileComponent } from './components/sq-input-file/sq-input-file.component'
import { SqDropdownDirective } from './directives/sq-dropdown/sq-dropdown.directive'
import { SqSelectSearchComponent } from './components/sq-select-search/sq-select-search.component'
import { SqClickOutsideDirective } from './directives/sq-click-outside/sq-click-outside.directive'
import { SearchPipe } from './pipes/search/search.pipe'
import { SqSelectMultiTagsComponent } from './components/sq-select-multi-tags/sq-select-multi-tags.component'
import { SqInputMaskComponent } from './components/sq-input-mask/sq-input-mask.component'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import { SqInputMoneyComponent } from './components/sq-input-money/sq-input-money.component'
import { SqInputNumberComponent } from './components/sq-input-number/sq-input-number.component'

const components = [
  SqButtonComponent,
  SqLoaderComponent,
  SqProgressBarComponent,
  SqStepsComponent,
  SqTooltipDirective,
  SqTooltipComponent,
  UniversalSafePipe,
  ThousandSuffixesPipe,
  SqTabComponent,
  SqTabsComponent,
  SqInfinityComponent,
  SqOverlayComponent,
  SqModalComponent,
  SqCollapseComponent,
  SqPaginationComponent,
  SqTagsComponent,
  SqAccordionComponent,
  SqTextAreaComponent,
  SqSelectComponent,
  SqSelectorComponent,
  SqInputComponent,
  SqInputDateComponent,
  SqInputRangeComponent,
  SqInputFileComponent,
  SqDropdownDirective,
  SqSelectSearchComponent,
  SqClickOutsideDirective,
  SearchPipe,
  SqSelectMultiTagsComponent,
  SqInputMaskComponent,
  SqInputMoneyComponent,
  SqInputNumberComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  exports: [
    ...components,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})
export class SquidCSSModule { }
