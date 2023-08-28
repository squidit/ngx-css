import { DOCUMENT } from '@angular/common'
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
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
  @Input() open?: boolean
  @Input() modalSize: 'sm' | 'md' | 'lg' | string = 'md'
  @Input() modalClass?: string
  @Input() backdropClass?: string
  @Input() needPriority?: boolean

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

  constructor(@Inject(DOCUMENT) public documentImported: Document) {
    this.onKeydown = this.onKeydown.bind(this)
    this.document = documentImported || document
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('open') || changes.hasOwnProperty('needPriority')) {
      const body = this.document.getElementsByTagName('body')[0]
      const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
      if (this.open && this.modal) {
        this.hasHeader = !!this.headerTemplate
        this.modals = this.document.getElementsByClassName('modal open')
        body.classList.add('block')
        this.modal.nativeElement.style.display = 'flex'
        window.addEventListener('keydown', this.onKeydown)
        setTimeout(() => {
          this.modalNumber = this.modals?.length || 0
          if (this.modalNumber === 1) {
            backdrop.setAttribute('id', 'modal-backdrop')
            backdrop.setAttribute('class', 'modal-backdrop show')
            body.appendChild(backdrop)
          }
        })
        if (this.needPriority) {
          backdrop.setAttribute('style', 'z-index: 1080;')
        }
      } else if (this.modal) {
        this.modalClose.emit()
        this.modal.nativeElement.style.display = 'none'
        if (backdrop.parentNode && this.modalNumber === 1) {
          backdrop.parentNode.removeChild(backdrop)
          body.classList.remove('block')
        }
        window.removeEventListener('keydown', this.onKeydown)
        if (this.needPriority) {
          backdrop.removeAttribute('style')
        }
      }
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (this.open) {
      this.modals = this.document.getElementsByClassName('modal')
      if (this.modals?.length === this.modalNumber) {
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