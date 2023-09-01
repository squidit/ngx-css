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
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'sq-overlay',
  templateUrl: './sq-overlay.component.html',
  styleUrls: ['./sq-overlay.component.scss'],
})
export class SqOverlayComponent implements OnChanges, OnDestroy {
  @Input() id?: string
  @Input() open?: boolean
  @Input() overlayDirection: 'right' | 'left' = 'right'
  @Input() width = '475px'
  @Input() borderless = false
  @Input() headerColor = 'var(--background_secondary)'
  @Input() headerItemsColor = ''
  @Input() footerColor = 'var(--background_secondary)'
  @Input() bodyColor = 'var(--background_secondary)'
  @Input() showClose = true
  @Input() backdrop = 'static'

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
  enableBackdropClick = false
  finishOpening = false

  constructor(@Inject(DOCUMENT) public documentImported: Document) {
    this.onKeydown = this.onKeydown.bind(this)
    this.document = documentImported || document
  }

  @HostListener('document:click', ['$event'])
  backdropClick(event: any) {
    if (this.backdrop === 'static' || !this.overlay || !this.open || !this.enableBackdropClick) {
      return
    }
    const modalDialog = this.overlay.nativeElement.firstElementChild
    if (!modalDialog?.contains(event.target)) {
      this.toCloseOverlay()
    }
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
      const overlay = this.overlay
      if (this.open && overlay) {
        this.doCssWidth()
        this.hasFooter = !!this.footerTemplate
        this.hasHeader = !!this.headerTemplate
        this.modals = this.document.getElementsByClassName('modal open')
        body.classList.add('block')
        overlay.nativeElement.style.display = 'flex'
        window.addEventListener('keydown', this.onKeydown)
        setTimeout(() => {
          this.modalNumber = this.modals?.length || 0
          if (this.modalNumber === 1) {
            backdrop.setAttribute('id', 'modal-backdrop')
            backdrop.setAttribute('class', 'modal-backdrop show')
            body.appendChild(backdrop)
          } else if (this.modalNumber > 1) {
            overlay.nativeElement.style.zIndex = 1060 + this.modalNumber + 1
            setTimeout(() => {
              backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`)
            }, 200)
          }
          this.enableBackdropClick = true
          this.finishOpening = true
        })
      } else if (overlay) {
        this.overlayClose.emit()
        this.finishOpening = false
        this.undoCssWidth()
        setTimeout(() => {
          if (overlay) {
            overlay.nativeElement.style.display = 'none'
            overlay.nativeElement.style.zIndex = null
          }
        })
        if (backdrop.parentNode && this.modalNumber === 1) {
          backdrop.parentNode.removeChild(backdrop)
          body.classList.remove('block')
        }
        this.enableBackdropClick = false
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

  onKeydown(event: any) {
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

  toCloseOverlay() {
    if (this.overlay && this.open) {
      const body = this.document.getElementsByTagName('body')[0]
      const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
      this.overlayClose.emit()
      this.overlay.nativeElement.style.display = 'none'
      if (backdrop.parentNode && this.modalNumber === 1) {
        backdrop.parentNode.removeChild(backdrop)
        body.classList.remove('block')
      }
      window.removeEventListener('keydown', this.onKeydown)
      this.enableBackdropClick = false
    }
  }
}
