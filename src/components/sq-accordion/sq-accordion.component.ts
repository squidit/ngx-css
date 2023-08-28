import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy
} from '@angular/core'
import { SqCollapseComponent } from './sq-collapse/sq-collapse.component'

@Component({
  selector: 'sq-accordion',
  templateUrl: './sq-accordion.component.html',
  styleUrls: ['./sq-accordion.component.scss']
})
export class SqAccordionComponent implements AfterContentInit, OnDestroy {
  @Input() onlyOne?: boolean
  @Input() openFirst?: boolean
  @ContentChildren(SqCollapseComponent)
  collapses: QueryList<SqCollapseComponent> = [] as unknown as QueryList<SqCollapseComponent>

  ngAfterContentInit(): void {
    if (this.openFirst) {
      setTimeout(() => {
        this.collapses.toArray()[0].toggleCollapse()
      }, 300)
    }
    this.collapses.toArray().forEach((collapse) => {
      collapse.openedEmitter.subscribe(() => {
        this.openCollapse(collapse)
      })
    })
    this.collapses.changes.subscribe(() => {
      this.collapses.toArray().forEach((collapse) => {
        collapse.openedEmitter.subscribe(() => {
          this.openCollapse(collapse)
        })
      })
    })
  }

  ngOnDestroy(): void {
    if (this.collapses) {
      this.collapses.toArray().forEach((collapse) => {
        collapse.openedEmitter.unsubscribe()
      })
    }
  }

  openCollapse(collapse: SqCollapseComponent): void {
    if (this.onlyOne) {
      this.collapses.toArray().forEach((thisCollapse) => {
        if (thisCollapse.open) {
          thisCollapse.toggleCollapse()
        }
      })
    }
    collapse.toggleCollapse()
  }
}
