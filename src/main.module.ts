import { ScrollingModule } from '@angular/cdk/scrolling'
import { CommonModule } from '@angular/common'
import { NgModule, Type } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import { SqAccordionComponent } from './components/sq-accordion/sq-accordion.component'
import { SqCollapseComponent } from './components/sq-accordion/sq-collapse/sq-collapse.component'
import { SqButtonComponent } from './components/sq-button/sq-button.component'
import { SqCountdownComponent } from './components/sq-countdown/sq-countdown.component'
import { SqInfinityComponent } from './components/sq-infinity-scroll/sq-infinity-scroll.component'
import { SqInputDateComponent } from './components/sq-input-date/sq-input-date.component'
import { SqInputFileComponent } from './components/sq-input-file/sq-input-file.component'
import { SqInputMaskComponent } from './components/sq-input-mask/sq-input-mask.component'
import { SqInputMoneyComponent } from './components/sq-input-money/sq-input-money.component'
import { SqInputNumberComponent } from './components/sq-input-number/sq-input-number.component'
import { SqInputRangeComponent } from './components/sq-input-range/sq-input-range.component'
import { SqInputComponent } from './components/sq-input/sq-input.component'
import { SqLoaderComponent } from './components/sq-loader/sq-loader.component'
import { SqModalComponent } from './components/sq-modal/sq-modal.component'
import { SqOverlayComponent } from './components/sq-overlay/sq-overlay.component'
import { SqPaginationComponent } from './components/sq-pagination/sq-pagination.component'
import { SqProgressBarComponent } from './components/sq-progress-bar/sq-progress-bar.component'
import { SqSelectMultiTagsComponent } from './components/sq-select-multi-tags/sq-select-multi-tags.component'
import { SqSelectSearchComponent } from './components/sq-select-search/sq-select-search.component'
import { SqSelectComponent } from './components/sq-select/sq-select.component'
import { SqSelectorComponent } from './components/sq-selector/sq-selector.component'
import { SqStepsComponent } from './components/sq-steps/sq-steps.component'
import { SqTabComponent } from './components/sq-tabs/sq-tab/sq-tab.component'
import { SqTabsComponent } from './components/sq-tabs/sq-tabs.component'
import { SqTagComponent } from './components/sq-tag/sq-tag.component'
import { SqTextAreaComponent } from './components/sq-textarea/sq-textarea.component'
import { SqTooltipComponent } from './components/sq-tooltip/sq-tooltip.component'
import { SqClickOutsideDirective } from './directives/sq-click-outside/sq-click-outside.directive'
import { SqDropdownDirective } from './directives/sq-dropdown/sq-dropdown.directive'
import { SqTooltipDirective } from './directives/sq-tooltip/sq-tooltip.directive'
import { BirthdatePipe } from './pipes/birthdate/birthdate.pipe'
import { RemoveHtmlTagsPipe } from './pipes/remove-html-tags/remove-html-tags.pipe'
import { SearchFromAlternativeArrayPipe } from './pipes/search-from-alternative-array/search-from-alternative-array.pipe'
import { SearchValidValuesPipe } from './pipes/search-valid-values/search-valid-values.pipe'
import { SearchPipe } from './pipes/search/search.pipe'
import { ThousandSuffixesPipe } from './pipes/thousands/thousands.pipe'
import { TranslateInternalPipe } from './pipes/translate-internal/translate-internal.pipe'
import { UniversalSafePipe } from './pipes/universal-safe/universal-safe.pipe'
/**
 * Array containing a collection of Angular components, directives, and pipes.
 * These elements can be used within the SquidCSSModule for building UI features.
 * 
 * @type {(Type<any> | any)[]}
 */
const components: (Type<any> | any)[] = [
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
  SqTagComponent,
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
  BirthdatePipe,
  SearchFromAlternativeArrayPipe,
  SearchValidValuesPipe,
  SqSelectMultiTagsComponent,
  SqInputMaskComponent,
  SqInputMoneyComponent,
  SqInputNumberComponent,
  TranslateInternalPipe,
  RemoveHtmlTagsPipe
]

/**
 * Angular module that exports a collection of UI components, directives, and pipes
 * for use in Angular applications.
 */
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    SqCountdownComponent,
    NgxMaskDirective,
    NgxMaskPipe,
    ScrollingModule
  ],
  providers: [
    provideNgxMask()
  ],
  exports: [
    ...components,
    SqCountdownComponent,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})
export class SquidCSSModule { }
