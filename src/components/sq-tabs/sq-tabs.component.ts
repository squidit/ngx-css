import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core'
import { useMemo } from '../../helpers/memo.helper'
import { SqTabComponent } from './sq-tab/sq-tab.component'
import { Subject, takeUntil } from 'rxjs'

/**
 * Represents a tab container component for managing a collection of tabs.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/tabs}
 *
 * @example
 * <sq-tabs [lineStyle]="true" (tabChange)="handleTabChange($event)">
 *   <sq-tab [title]="'Tab 1'" (whenOpen)="handleTabOpen()">Tab 1 Content</sq-tab>
 *   <sq-tab [title]="'Tab 2'">Tab 2 Content</sq-tab>
 *   <!-- Add more sq-tab elements as needed -->
 * </sq-tabs>
 *
 * @implements {AfterViewInit}
 * @implements {AfterViewChecked}
 */
@Component({
  selector: 'sq-tabs',
  templateUrl: './sq-tabs.component.html',
  styleUrls: ['./sq-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqTabsComponent implements AfterViewInit, AfterViewChecked {
  /**
   * A query list of `SqTabComponent` elements representing the tabs.
   */
  @ContentChildren(SqTabComponent) tabs: QueryList<SqTabComponent> = [] as unknown as QueryList<SqTabComponent>

  /**
   * Custom CSS class for the input element.
   */
  @Input() customClass = ''

  /**
   * The height of the tab container.
   * @default undefined
   */
  @Input() height?: string

  /**
   * The maximum width of the tab container.
   * @default 'initial'
   */
  @Input() maxWidth = 'initial'

  /**
   * The margin of the tab container.
   * @default '0 auto'
   */
  @Input() margin = '0 auto'

  /**
   * Flag to indicate whether to display a line-style indicator for the selected tab.
   * @default false
   */
  @Input() lineStyle = false

  /**
   * The width of individual tabs.
   * @default ''
   */
  @Input() tabWidth = ''

  /**
   * Flag to indicate to use small size for tabs header.
   * @default true
   */
  @Input() sm = true

  /**
   * Flag to hide HTML content for inactive tabs.
   * @default false
   */
  @Input() hideHtmlForInactives = false

  /**
   * Event emitted when a tab is changed.
   * @eventProperty
   */
  @Output() tabChange: EventEmitter<{ tab: SqTabComponent; index: number }> = new EventEmitter()

  /**
   * The total number of tabs in the container.
   */
  total = 1

  /**
   * Subject used to manage component lifecycle and unsubscribe from observables.
   * @private
   */
  private destroy$ = new Subject<void>()

  /**
   * Creates an instance of SqTabsComponent.
   * @param cdr - The ChangeDetectorRef service for manual change detection control.
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Angular lifecycle hook called after component's view has been initialized.
   * Sets up initial tab selection and subscriptions.
   */
  ngAfterViewInit() {
    this.setupTabsSubscription()

    const activeTab = {
      tab: this.tabs.find((tab: { active: any }) => tab.active),
      index: this.tabs.toArray().findIndex((tab: { active: any }) => tab.active),
    }

    /**
     * setTimeout sem delay para:
     *  - Colocar a execução no final da fila de eventos (microtask queue)
     *  - Evitar ExpressionChangedAfterItHasBeenCheckedError
     *  - Manter tempo de resposta instantâneo (sem delay artificial)
     */
    setTimeout(() => {
      if (activeTab.tab?.title) {
        this.selectTab(activeTab.tab, activeTab.index)
      } else if (this.tabs.first) {
        this.selectTab(this.tabs.first, 0)
      }

      this.total = this.tabs.toArray().length || 1
      this.cdr.markForCheck()
    })
  }

  /**
   * Angular lifecycle hook called after the view has been checked.
   * Updates the total tab count if it has changed.
   */
  ngAfterViewChecked(): void {
    if (this.tabs.toArray().length !== this.total) {
      this.total = this.tabs.toArray().length || 1
      this.cdr.markForCheck()
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   * Cleans up subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Selects a tab by making it active.
   *
   * @param {SqTabComponent} tab - The tab to be selected.
   * @param {number} index - The index of the selected tab.
   * @returns {null} - Always returns null (no explicit return value).
   */
  selectTab(tab: SqTabComponent, index: number): null {
    if (tab?.disabled || tab?.loading) {
      return null
    }

    this.tabs.toArray().forEach((tabItem: { active: boolean; hideHtml: boolean }) => {
      tabItem.active = false
      if (this.hideHtmlForInactives) {
        tabItem.hideHtml = true
      }
    })

    if (tab) {
      tab.active = true
      tab.hideHtml = false

      this.tabChange.emit({ tab, index })

      if (tab.whenOpen) {
        tab.whenOpen.emit()
      }
    }

    this.cdr.markForCheck()
    return null
  }

  /**
   * Memoized function to determine tab width based on conditions.
   *
   * @param {string} tabWidth - The width of the tab.
   * @param {boolean} lineStyle - A flag to determine if line style is applied.
   * @returns {string} - Returns 'fit-content' if lineStyle is true,
   *                     the provided tabWidth if it exists,
   *                     otherwise returns 'initial'.
   */
  memoizedTabWidth = useMemo((tabWidth: string, lineStyle: boolean): string => {
    if (tabWidth) {
      return tabWidth
    }
    if (lineStyle) {
      return 'fit-content'
    }
    return 'initial'
  })

  /**
   * Sets up subscription to track changes in the tabs QueryList.
   * Updates the total tab count when tabs are added/removed.
   * @private
   */
  private setupTabsSubscription(): void {
    this.tabs.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.total = this.tabs.toArray().length || 1
        this.cdr.markForCheck()
      })
  }
}