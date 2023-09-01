import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy
} from '@angular/core'
import { SqCollapseComponent } from './sq-collapse/sq-collapse.component'

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
  @ContentChildren(SqCollapseComponent)
  collapses: QueryList<SqCollapseComponent> = [] as unknown as QueryList<SqCollapseComponent>

  /**
   * Performs actions after the content has been initialized.
   */
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

  /**
   * Performs actions before the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.collapses) {
      this.collapses.toArray().forEach((collapse) => {
        collapse.openedEmitter.unsubscribe()
      })
    }
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
}
