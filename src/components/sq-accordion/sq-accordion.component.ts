import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  ElementRef
} from '@angular/core'
import { SqCollapseComponent } from './sq-collapse/sq-collapse.component'
import { sleep } from '../../helpers/sleep.helper'
import { Subscription } from 'rxjs'

/**
 * Represents the SqAccordionComponent, an accordion component that manages a collection of SqCollapseComponents.
 * 
 * @implements {AfterContentInit}
 * @implements {OnDestroy}
 * 
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/accordion-collapse}
 *
 * @example
 * <sq-accordion [onlyOne]="true">
 *   <sq-collapse>
*      <ng-container header>
 *        <div>Header Content</div>
 *      </ng-container>  
 *      Body Collpase content
 *    </sq-collapse>
 *   <sq-collapse>
 *    Body Collpase content
 *   </sq-collapse>
 * </sq-accordion>
 */
@Component({
  selector: 'sq-accordion',
  templateUrl: './sq-accordion.component.html',
  styleUrls: ['./sq-accordion.component.scss'],
})
export class SqAccordionComponent implements AfterContentInit, OnDestroy {
  /**
   * Indicates whether only one SqCollapseComponent can be open at a time.
   */
  @Input() onlyOne?: boolean

  /**
   * Indicates whether the first SqCollapseComponent should be open initially.
   */
  @Input() openFirst?: boolean

  /**
   * A QueryList containing the SqCollapseComponent instances within the accordion.
   */
  @ContentChildren(SqCollapseComponent, { descendants: true }) collapses: QueryList<SqCollapseComponent> = [] as unknown as QueryList<SqCollapseComponent>
  
  /**
   * A subscription to the changes of the collapses QueryList.
   * This subscription is used to update the collapses QueryList when the content changes.
   */
  collapsesSubscription: Subscription = new Subscription()

  /**
   * Initializes a new instance of the SqAccordionComponent class.
   * @param elementRef - The ElementRef instance.
   */
  constructor(private elementRef: ElementRef) {}

  /**
   * Performs actions after the content has been initialized.
   */
  async ngAfterContentInit() {
    this.filterChildren()

    this.collapsesSubscription = this.collapses.changes.subscribe(() => {
      this.filterChildren()
    })

    if (this.openFirst) {
      const collapses = this.collapses.toArray()
      if (collapses?.length) {
        await sleep()
        this.collapses.toArray()[0].toggleCollapse()
      }
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

  /**
   * Performs actions before the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.collapses) {
      this.collapses.toArray().forEach((collapse) => {
        collapse.openedEmitter.unsubscribe()
      })
    }

    this.collapsesSubscription?.unsubscribe()
  }

  /**
   * Opens or closes a specified SqCollapseComponent.
   * @param collapse - The SqCollapseComponent to open or close.
   */
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

  /**
   * Filters the children of the accordion.
   * This method is used to filter the children of the accordion and update the collapses QueryList.
   */
  filterChildren() {
    const hostElement = this.elementRef.nativeElement
    const filteredChildren = this.collapses.filter(collapse => {
      let parent = collapse['elementRef'].nativeElement.parentElement
      for (let i = 0; i < 4; i++) {
      if (parent === hostElement) {
        return true
      }
      parent = parent.parentElement
      }
      return false
    })
    this.collapses.reset(filteredChildren)
  }
}
