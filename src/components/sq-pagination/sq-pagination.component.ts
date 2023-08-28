import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { useMemo } from '../../helpers/memo.helper'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'sq-pagination',
  templateUrl: './sq-pagination.component.html',
  styleUrls: ['./sq-pagination.component.scss']
})
export class SqPaginationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() customClass = ''
  @Input() currentPage = 1
  @Input() totalPages = 1
  @Input() showPages = 5
  @Input() useQueryString = false

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>()

  constructor(private route: ActivatedRoute, private router: Router) { }

  page = this.currentPage
  pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
  routeObservable!: Subscription

  ngOnInit() {
    this.routeObservable = this.route.queryParams.subscribe(search => {
      const searchParams = new URLSearchParams(search)
      const newPageQuery = parseInt(searchParams.get('page') || '1', 10)
      if (newPageQuery !== this.currentPage) {
        this.page = newPageQuery
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage'] && changes['currentPage'].currentValue !== changes['currentPage'].previousValue) {
      this.page = this.currentPage
    }
    if (changes['totalPages'] && changes['totalPages'].currentValue !== changes['totalPages'].previousValue) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
    }
    if (changes['useQueryString'] && changes['useQueryString'].currentValue !== changes['useQueryString'].previousValue) {
      if (this.useQueryString) {
        this.mountQueryObservable()
      } else {
        this.destroyQueryObservable()
      }
    }
  }

  ngOnDestroy() {
    this.destroyQueryObservable()
  }

  mountQueryObservable() {
    this.routeObservable = this.route.queryParams.subscribe(search => {
      const searchParams = new URLSearchParams(search)
      const newPageQuery = parseInt(searchParams.get('page') || '1', 10)
      if (newPageQuery !== this.currentPage) {
        this.page = newPageQuery
      }
    })
  }

  destroyQueryObservable() {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('page')
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: null }, queryParamsHandling: 'merge' })
    this.routeObservable?.unsubscribe()
  }

  canShow = useMemo((actualPage: number) => {
    const half = this.calculateHalf()
    return actualPage === this.page || (actualPage >= this.page - half && actualPage <= this.page + half)
  })

  showDotMax = useMemo((actualPage: number) => {
    const half = this.calculateHalf()
    return actualPage + half < this.totalPages
  })

  showDotMin = useMemo((actualPage: number) => {
    const half = this.calculateHalf()
    return actualPage - half > 1
  })

  calculateHalf() {
    return Math.floor(this.showPages / 2)
  }

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
