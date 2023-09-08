import { AfterViewChecked, AfterViewInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core'
import { SqTabComponent } from './sq-tab/sq-tab.component'
import { sleep } from '../../helpers/sleep.helper'

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
})
export class SqTabsComponent implements AfterViewInit, AfterViewChecked {
  /**
   * A query list of `SqTabComponent` elements representing the tabs.
   */
  @ContentChildren(SqTabComponent) tabs: QueryList<SqTabComponent> = [] as unknown as QueryList<SqTabComponent>

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
   * Flag to indicate too use sm class com tabs header.
   */
  @Input() sm = true

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
   * Lifecycle hook called after the view initialization.
   */
  async ngAfterViewInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active)
    if (activeTabs.length === 0) {
      await sleep(1000)
      if (this.tabs.first) {
        this.selectTab(this.tabs.first, 0)
      }
    }

    this.total = this.tabs.toArray().length || 1
  }

  /**
   * Lifecycle hook called after the view has been checked.
   */
  ngAfterViewChecked(): void {
    if (this.tabs.toArray().length !== this.total) {
      this.total = this.tabs.toArray().length || 1
    }
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
    this.tabs.toArray().forEach((tabItem) => (tabItem.active = false))
    if (tab) {
      this.tabChange.emit({
        tab,
        index,
      })
      tab.active = true

      if (tab.whenOpen) {
        tab.whenOpen.emit()
      }
    }
    return null
  }
}
