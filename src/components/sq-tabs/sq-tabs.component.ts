import { AfterViewChecked, AfterViewInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core'
import { SqTabComponent } from './sq-tab/sq-tab.component'

@Component({
  selector: 'sq-tabs',
  templateUrl: './sq-tabs.component.html',
  styleUrls: ['./sq-tabs.component.scss'],
})
export class SqTabsComponent implements AfterViewInit, AfterViewChecked {
  @ContentChildren(SqTabComponent) tabs: QueryList<SqTabComponent> = [] as unknown as QueryList<SqTabComponent>

  @Input() height?: string
  @Input() maxWidth = 'initial'
  @Input() margin = '0 auto'
  @Input() lineStyle = false

  @Output() tabChange: EventEmitter<{ tab: SqTabComponent, index: number }> = new EventEmitter()

  total = 1
  tabsPosition = 'initial'

  ngAfterViewInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active)
    if (activeTabs.length === 0) {
      setTimeout(() => {
        if (this.tabs.first) {
          this.selectTab(this.tabs.first, 0)
        }
      }, 1000)
    }

    this.total = this.tabs.toArray().length || 1
  }

  ngAfterViewChecked(): void {
    if (this.tabs.toArray().length !== this.total) {
      this.total = this.tabs.toArray().length || 1
    }
  }

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
