import { DOCUMENT } from '@angular/common'
import { AfterContentChecked, AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, ViewChild } from '@angular/core'
import { GetWindow } from 'src/helpers/window.helper'

/**
 * Represents the SqInfinityComponent, a component for infinite scrolling.
 *
 * @implements {AfterViewInit}
 * @implements {AfterContentChecked}
 * @implements {OnDestroy}
 *
 * @example
 * <sq-infinity-scroll [length]="totalItems" [hasMore]="hasMoreData" [loading]="isLoading" (scrolledEmitter)="loadMoreItems()">
 *    <!-- Content Here -->
 * </sq-infinity-scroll>
 */
@Component({
  selector: 'sq-infinity-scroll',
  templateUrl: './sq-infinity-scroll.component.html',
  styleUrls: ['./sq-infinity-scroll.component.scss']
})
export class SqInfinityComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  /**
   * Reference to the scroll element.
   */
  @ViewChild('scroll', { static: true }) scrollElement?: ElementRef

  /**
   * The total number of items in the list.
   */
  @Input() length = 0

  /**
   * The message to display when reaching the end of the list.
   */
  @Input() endMessage?: string

  /**
   * Indicates whether there are more items to load.
   */
  @Input() hasMore?: boolean | string = true

  /**
   * Indicates whether data is currently being loaded.
   */
  @Input() loading?: boolean

  /**
   * The color of the loader.
   */
  @Input() loaderColor?: string

  /**
   * The ID of the element to scroll (if using a custom scrolling element).
   */
  @Input() elementToScrollId?: string

  /**
   * Event emitter for when the user scrolls to trigger loading more items.
   */
  @Output() scrolledEmitter: EventEmitter<void> = new EventEmitter()

  /**
   * Element that have the scroll listener
   */
  elementToScroll?: HTMLElement | null | Window & typeof globalThis

  /**
   * Reference to the Document object for interacting with the DOM.
   */
  document: Document

  /**
   * Creates an instance of SqInfinityComponent.
   * @constructor
   * @param {Document} documentImported Reference to the Document object for interacting with the DOM.
   * @param {GetWindow} getWindow Reference to the GetWindow service for safely accessing the window object.
   */
  constructor(@Inject(DOCUMENT) public documentImported: Document, public getWindow: GetWindow) {
    this.document = this.documentImported || document
  }

  /**
   * Performs actions after the view has been initialized.
   */
  ngAfterViewInit(): void {
    const { elementToScrollId } = this

    if (elementToScrollId) {
      this.elementToScroll = this.document.getElementById(elementToScrollId)
    }

    if (!elementToScrollId || !this.elementToScroll) {
      this.elementToScroll = this.getWindow.window()
    }
    this.elementToScroll?.addEventListener('scroll', this.onScroll, false)
  }

  /**
   * Performs actions after content has been checked.
   */
  ngAfterContentChecked(): void {
    if (this.elementToScrollId && this.elementToScroll && this.elementToScroll instanceof HTMLElement && typeof this.elementToScroll.getAttribute === 'undefined') {
      const element = this.document.getElementById(this.elementToScrollId)
      if (element) {
        this.elementToScroll.removeEventListener('scroll', this.onScroll, false)
        element.addEventListener('scroll', this.onScroll, false)
        this.elementToScroll = element
      }
    }
  }

  /**
   * Performs actions before the component is destroyed.
   */
  ngOnDestroy(): void {
    this.elementToScroll?.removeEventListener('scroll', this.onScroll, false)
  }

  /**
   * Handles the scroll event and triggers loading more items if applicable.
   */
  onScroll = () => {
    if (!this.loading && this.length > 0 && this.hasMore) {
      if (this.elementToScrollId && this.elementToScroll instanceof HTMLElement) {
        const allScroll = this.elementToScroll?.scrollTop + this.elementToScroll?.scrollHeight
        if (allScroll >= this.elementToScroll?.scrollHeight) {
          this.elementToScroll?.removeEventListener('scroll', this.onScroll, false)
          this.scrolledEmitter.emit()
          this.elementToScroll?.addEventListener('scroll', this.onScroll, false)
        }
      } else if (this.elementToScroll instanceof Window) {
        const elementHeight = this.elementToScroll?.innerHeight
        const elementY = this.elementToScroll?.scrollY
        if (elementHeight + elementY >= this.scrollElement?.nativeElement.offsetHeight + this.scrollElement?.nativeElement.offsetTop) {
          this.elementToScroll?.removeEventListener('scroll', this.onScroll, false)
          this.scrolledEmitter.emit()
          this.elementToScroll?.addEventListener('scroll', this.onScroll, false)
        }
      }
    }
  }
}
