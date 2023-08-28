import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { useMemo } from '../../helpers/memo.helper'

@Component({
  selector: 'sq-pagination',
  templateUrl: './sq-pagination.component.html',
  styleUrls: ['./sq-pagination.component.scss']
})
export class SqPaginationComponent implements OnChanges {
  @Input() customClass = ''
  @Input() currentPage = 1
  @Input() totalPages = 1
  @Input() showPages = 5

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>()

  page = this.currentPage
  pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage'] && changes['currentPage'].currentValue !== changes['currentPage'].previousValue) {
      this.page = this.currentPage
    }
    if (changes['totalPages'] && changes['totalPages'].currentValue !== changes['totalPages'].previousValue) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
    }
  }

  canShow = useMemo((actualPage: number) => {
    const half = Math.floor(this.showPages / 2)
    return actualPage === this.currentPage || (actualPage >= this.currentPage - half && actualPage <= this.currentPage + half)
  })

  showDotMax = useMemo(() => {
    const half = Math.floor(this.showPages / 2)
    return this.currentPage + half < this.totalPages
  })

  showDotMin = useMemo(() => {
    const half = Math.floor(this.showPages / 2)
    return this.currentPage - half > 1
  })

  handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) {
      return
    }
    this.page = newPage
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', newPage.toString())
    window.location.search = searchParams.toString()
    this.pageChange.emit(newPage)
  }
}
