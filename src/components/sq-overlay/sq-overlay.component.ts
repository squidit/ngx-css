import { DOCUMENT } from '@angular/common'
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'sq-overlay',
  templateUrl: './sq-overlay.component.html',
  styleUrls: ['./sq-overlay.component.scss'],
})
export class SqOverlayComponent implements OnChanges, OnDestroy {
  @Input() open?: boolean
  @Input() overlayDirection: 'right' | 'left' = 'right'
  @Input() width = '475px'
  @Input() borderless = false
  @Input() headerColor = 'var(--white-html)'
  @Input() headerItemsColor = 'var(--gray_dark)'
  @Input() footerColor = 'var(--white-html)'
  @Input() bodyColor = 'var(--white-html)'
  @Input() showClose = true

  @Output() overlayClose: EventEmitter<void> = new EventEmitter()
  @Output() leftPress: EventEmitter<void> = new EventEmitter()
  @Output() rightPress: EventEmitter<void> = new EventEmitter()

  @ViewChild('overlay') overlay: ElementRef | null = null

  @ContentChild('headerTemplate') headerTemplate?: TemplateRef<ElementRef> | null = null
  @ContentChild('footerTemplate') footerTemplate?: TemplateRef<ElementRef> | null = null

  modals: HTMLCollectionOf<Element> | undefined
  modalNumber = 0
  hasHeader = false
  hasFooter = false
  document: Document
  styleId = ''
  opened = false

  constructor(private router: Router, @Inject(DOCUMENT) public documentImported: Document) {
    this.onKeydown = this.onKeydown.bind(this)
    this.document = documentImported || document
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('width')) {
      if (this.open) {
        this.doCssWidth()
      }
    }
    if (changes.hasOwnProperty('open')) {
      const body = this.document.getElementsByTagName('body')[0]
      const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
      if (this.open && this.overlay) {
        this.doCssWidth()
        this.hasFooter = !!this.footerTemplate
        this.hasHeader = !!this.headerTemplate
        this.modals = this.document.getElementsByClassName('modal open')
        body.classList.add('block')
        this.overlay.nativeElement.style.display = 'flex'
        window.addEventListener('keydown', this.onKeydown)
        setTimeout(() => {
          this.modalNumber = this.modals?.length || 0
          if (this.modalNumber === 1) {
            backdrop.setAttribute('id', 'modal-backdrop')
            backdrop.setAttribute('class', 'modal-backdrop show')
            body.appendChild(backdrop)
          }
          this.opened = true
        })
      } else if (this.overlay) {
        this.overlayClose.emit()
        this.opened = false
        this.undoCssWidth()
        setTimeout(() => {
          if (this.overlay) {
            this.overlay.nativeElement.style.display = 'none'
          }
        })
        if (backdrop.parentNode && this.modalNumber === 1) {
          backdrop.parentNode.removeChild(backdrop)
          body.classList.remove('block')
        }
        window.removeEventListener('keydown', this.onKeydown)
      }
    }
  }

  ngOnDestroy() {
    this.undoCssWidth()
  }

  doCssWidth() {
    if (!this.styleId) {
      this.styleId = `overlay-${new Date().getTime()}-${Math.random().toString(36).substring(7)}`
    }
    const css = `
      .overlay.open .modal-dialog.opened {
        width: ${this.width};
      }
    `
    const head = this.document.getElementsByTagName('head')[0]
    let style = this.document.getElementById(this.styleId)
    if (!style) {
      style = this.document.createElement('style')
      style.setAttribute('id', this.styleId)
      style.appendChild(this.document.createTextNode(css))
      head.appendChild(style)
    } else {
      style.innerHTML = ''
      style.appendChild(this.document.createTextNode(css))
    }
  }

  undoCssWidth() {
    const style = document.getElementById(this.styleId)
    if (style?.parentNode) {
      style.parentNode.removeChild(style)
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (this.open) {
      this.modals = this.document.getElementsByClassName('modal open')
      if (this.modals?.length === this.modalNumber) {
        this.events(event.keyCode)
      }
    }
  }

  events(key: number) {
    switch (key) {
      case 27:
        this.overlayClose.emit()
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
