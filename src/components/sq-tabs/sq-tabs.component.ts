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
   */
  @Input() height?: string

  /**
   * The maximum width of the tab container.
   */
  @Input() maxWidth = 'initial'

  /**
   * The margin of the tab container.
   */
  @Input() margin = '0 auto'

  /**
   * Flag to indicate whether to display a line-style indicator for the selected tab.
   */
  @Input() lineStyle = false

  /**
   * The width of the tab container.
   */
  @Input() tabWidth = ''

  /**
   * Flag to indicate to use sm class com tabs header.
   */
  @Input() sm = true

  /**
   * Flag to hide html for inactive tabs.
   */
  @Input() hideHtmlForInactives = false

  /**
   * Event emitted when a tab is changed.
   */
  @Output() tabChange: EventEmitter<{ tab: SqTabComponent; index: number }> = new EventEmitter()

  /**
   * The total number of tabs in the container.
   */
  total = 1

  /**
   * The initial position of the tabs.
   */
  tabsPosition = 'initial'

  /**
   * The initial width of the tabs.
   */
  private destroy$ = new Subject<void>()

  /**
   * Constructor for the SqTabs class.
   * @param cdr - The change detector reference.
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Lifecycle hook called after the view initialization.
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
   * Lifecycle hook called after the view has been checked.
   */
  ngAfterViewChecked(): void {
    if (this.tabs.toArray().length !== this.total) {
      this.total = this.tabs.toArray().length || 1
      this.cdr.markForCheck()
    }
  }

  /**
   * Lifecycle hook called when the component is destroyed.
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
   */
  selectTab(tab: SqTabComponent, index: number) {
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
   * Determines the tab width based on the provided conditions.
   *
   * @param {string} tabWidth - The width of the tab.
   * @param {boolean} lineStyle - A flag to determine if line style is applied.
   *
   * @returns {string} - Returns 'fit-content' if lineStyle is true.
   *                     Returns the provided tabWidth if it exists.
   *                     Otherwise, returns 'initial'.
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

  private setupTabsSubscription() {
    this.tabs.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.total = this.tabs.toArray().length || 1;
        this.cdr.markForCheck()
      })
  }
}
