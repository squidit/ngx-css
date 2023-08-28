import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy
} from '@angular/core'
import { CollapseComponent } from '../collapse/collapse.component'

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements AfterContentInit, OnDestroy {
  @Input() onlyOne?: boolean
  @Input() openFirst?: boolean
  @ContentChildren(CollapseComponent)
  collapses: QueryList<CollapseComponent>

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

  openCollapse(collapse: CollapseComponent): void {
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
