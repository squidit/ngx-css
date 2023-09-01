import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { useMemo } from '../../helpers/memo.helper'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'

/**
 * Represents a pagination component for navigating through pages.
 *
 * @example
 * <sq-pagination [currentPage]="currentPage" [totalPages]="totalPages" [showPages]="5" (pageChange)="onPageChange($event)"></sq-pagination>
 *
 * @implements {OnInit, OnChanges, OnDestroy}
 */
@Component({
  selector: 'sq-pagination',
  templateUrl: './sq-pagination.component.html',
  styleUrls: ['./sq-pagination.component.scss']
})
export class SqPaginationComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * A custom CSS class for styling the component.
   */
  @Input() customClass = ''

  /**
   * The current page number.
   */
  @Input() currentPage = 1

  /**
   * The total number of pages.
   */
  @Input() totalPages = 1

  /**
   * The number of page links to show in the pagination control.
   */
  @Input() showPages = 5

  /**
   * Indicates whether to use query string parameters for page navigation.
   */
  @Input() useQueryString = false

  /**
   * Emits an event when the current page is changed.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>()

  /**
   * The current page number.
   */
  page = this.currentPage

  /**
   * An array of page numbers to display in the pagination control.
   */
  pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)

  /**
   * A subscription to the route query parameters.
   */
  routeObservable!: Subscription


  /**
   * Initializes a new instance of the `SqPaginationComponent` class.
   *
   * @param {ActivatedRoute} route - The ActivatedRoute service for retrieving route information.
   * @param {Router} router - The Router service for programmatic navigation.
   */
  constructor(private route: ActivatedRoute, private router: Router) { }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.createOrDestroyQueryObservable()
  }

  /**
   * Responds to changes in input properties.
   *
   * @param {SimpleChanges} changes - The changes in input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage'] && changes['currentPage'].currentValue !== changes['currentPage'].previousValue) {
      this.page = this.currentPage
    }
    if (changes['totalPages'] && changes['totalPages'].currentValue !== changes['totalPages'].previousValue) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
    }
    if (changes['useQueryString'] && changes['useQueryString'].currentValue !== changes['useQueryString'].previousValue) {
      this.createOrDestroyQueryObservable()
    }
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy() {
    this.destroyQueryObservable()
  }

  /**
   * Creates or destroys the query parameter observable based on the `useQueryString` input.
   */
  createOrDestroyQueryObservable() {
    if (this.useQueryString) {
      this.mountQueryObservable()
    } else {
      this.destroyQueryObservable()
    }
  }

  /**
   * Mounts the query parameter observable to track page changes in the URL query string.
   */
  mountQueryObservable() {
    this.routeObservable = this.route.queryParams.subscribe(search => {
      const searchParams = new URLSearchParams(search)
      const newPageQuery = parseInt(searchParams.get('page') || '1', 10)
      if (newPageQuery !== this.page) {
        this.page = newPageQuery
      }
    })
  }

  /**
   * Destroys the query parameter observable and removes the 'page' query parameter from the URL.
   */
  destroyQueryObservable() {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('page')
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: null }, queryParamsHandling: 'merge' })
    this.routeObservable?.unsubscribe()
  }

  /**
   * Checks if a page number should be displayed based on the current page and showPages setting.
   *
   * @param {number} actualPage - The page number to check.
   * @returns {boolean} - `true` if the page should be shown, otherwise `false`.
   */
  canShow = useMemo((actualPage: number) => {
    const half = this.calculateHalf()
    return actualPage === this.page || (actualPage >= this.page - half && actualPage <= this.page + half)
  })

  /**
   * Checks if the maximum page number dot should be shown.
   *
   * @param {number} actualPage - The page number to check.
   * @returns {boolean} - `true` if the dot should be shown, otherwise `false`.
   */
  showDotMax = useMemo((actualPage: number) => {
    const half = this.calculateHalf()
    return actualPage + half < this.totalPages
  })

  /**
   * Checks if the minimum page number dot should be shown.
   *
   * @param {number} actualPage - The page number to check.
   * @returns {boolean} - `true` if the dot should be shown, otherwise `false`.
   */
  showDotMin = useMemo((actualPage: number) => {
    const half = this.calculateHalf()
    return actualPage - half > 1
  })

  /**
   * Calculates half of the `showPages` setting for determining which pages to display.
   */
  calculateHalf() {
    return Math.floor(this.showPages / 2)
  }

  /**
   * Handles a page change event and updates the page number.
   *
   * @param {number} newPage - The new page number.
   */
  handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) {
      return
    }
    if (this.useQueryString) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('page', newPage.toString())
      this.router.navigate([], { relativeTo: this.route, queryParams: { page: newPage }, queryParamsHandling: 'merge' })
    }

    this.page = newPage
    this.pageChange.emit(newPage)
  }
}
