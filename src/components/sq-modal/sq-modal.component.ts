import { DOCUMENT } from '@angular/common'
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'sq-modal',
  templateUrl: './sq-modal.component.html',
  styleUrls: ['./sq-modal.component.scss'],
})
export class SqModalComponent implements OnChanges {
  @Input() id = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  @Input() open?: boolean
  @Input() modalSize: 'sm' | 'md' | 'lg' | string = 'md'
  @Input() modalClass?: string
  @Input() backdropClass?: string
  @Input() backdrop = 'static'

  @Output() modalClose: EventEmitter<void> = new EventEmitter()
  @Output() leftPress: EventEmitter<void> = new EventEmitter()
  @Output() rightPress: EventEmitter<void> = new EventEmitter()

  @ViewChild('modal') modal: ElementRef | null = null

  @ContentChild('headerModal') headerTemplate?: TemplateRef<ElementRef> | null = null
  @ContentChild('footerModal') footerTemplate?: TemplateRef<ElementRef> | null = null

  modals: HTMLCollectionOf<Element> | undefined
  modalNumber = 0
  hasHeader = false
  document: Document
  enableBackdropClick = false
  modalsLength = 0

  constructor(@Inject(DOCUMENT) public documentImported: Document) {
    this.onKeydown = this.onKeydown.bind(this)
    this.document = documentImported || document
  }

  @HostListener('document:click', ['$event'])
  backdropClick(event: any) {
    if (this.backdrop === 'static' || !this.modal || !this.open || !this.enableBackdropClick) {
      return
    }
    const modalDialog = this.modal.nativeElement.firstElementChild
    if (!modalDialog?.contains(event.target)) {
      const body = this.document.getElementsByTagName('body')[0]
      const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
      this.modalClose.emit()
      this.modal.nativeElement.style.display = 'none'
      if (backdrop.parentNode && this.modalsLength === 1) {
        backdrop.parentNode.removeChild(backdrop)
        body.classList.remove('block')
      }
      window.removeEventListener('keydown', this.onKeydown)
      this.enableBackdropClick = false
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('open')) {
      const body = this.document.getElementsByTagName('body')[0]
      const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
      const modal = this.modal
      if (this.open && modal) {
        this.hasHeader = !!this.headerTemplate
        body.classList.add('block')
        modal.nativeElement.style.display = 'flex'
        window.addEventListener('keydown', this.onKeydown)
        this.modals = this.document.getElementsByClassName('modal open')
        setTimeout(() => {
          this.modalsLength = this.modals?.length || 0
          if (this.modalsLength === 1) {
            backdrop.setAttribute('id', 'modal-backdrop')
            backdrop.setAttribute('class', 'modal-backdrop show')
            body.appendChild(backdrop)
          } else if (this.modalsLength > 1) {
            modal.nativeElement.style.zIndex = 1060 + this.modalsLength + 1
            setTimeout(() => {
              backdrop.setAttribute('style', `z-index: ${1060 + this.modalsLength};`)
            }, 200)
          }
          this.enableBackdropClick = true
        })
      } else if (modal) {
        this.modalClose.emit()
        modal.nativeElement.style.display = 'none'
        modal.nativeElement.style.zIndex = null
        backdrop.removeAttribute('style')
        if (backdrop.parentNode && this.modalsLength === 1) {
          backdrop.parentNode.removeChild(backdrop)
          body.classList.remove('block')
        }
        this.enableBackdropClick = false
        window.removeEventListener('keydown', this.onKeydown)
      }
    }
  }

  onKeydown(event: any) {
    if (this.open) {
      this.modals = this.document.getElementsByClassName('modal')
      if (this.modals?.length === this.modalsLength) {
        this.events(event.keyCode)
      }
    }
  }

  events(key: number) {
    switch (key) {
      case 27:
        this.modalClose.emit()
        break
      case 37:
        this.leftPress.emit()
        break
      case 39:
        this.rightPress.emit()
        break
    }
  }
}
