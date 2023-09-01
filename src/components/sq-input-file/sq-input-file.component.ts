import { Component, ContentChild, ElementRef, Input, Optional, TemplateRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqInputComponent } from '../sq-input/sq-input.component'

/**
 * Represents a file input component that extends SqInputComponent.
 * 
 * This component extends the {@link SqInputComponent} and adds additional properties and behavior for handling money input.
 * 
 * @example
 * <sq-input-file [name]="'file-input'" [id]="'file-input'" [label]="'Upload File'" [(value)]='files'></sq-input-file>
 */
@Component({
  selector: 'sq-input-file',
  templateUrl: './sq-input-file.component.html',
  styleUrls: ['./sq-input-file.component.scss']
})
export class SqInputFileComponent extends SqInputComponent {
  /**
   * Text color for the file input.
   */
  @Input() textColor = 'var(--white-html)'

  /**
   * Border color for the file input.
   */
  @Input() override borderColor = 'var(--pink)'

  /**
   * Color for the file input.
   */
  @Input() color = 'var(--pink)'

  /**
   * Font size for the file input.
   */
  @Input() fontSize = '1rem'

  /**
   * Maximum allowed file size in bytes.
   */
  @Input() maxSize?: number

  /**
   * Indicates whether the file input is in a loading state.
   */
  @Input() loading = false

  /**
   * Allowed file types pattern (e.g., '*.jpg, *.png').
   */
  @Input() fileType = '*.*'

  /**
   * Indicates whether multiple files can be selected.
   */
  @Input() multiple = false

  /**
   * Indicates whether padding should be removed from the file input.
   */
  @Input() noPadding = false

  /**
   * Custom content to be displayed within the file input.
   */
  @ContentChild('customContent', { static: true })
  customContent: TemplateRef<HTMLElement> | null = null

  /**
   * Reference to the native element.
   */
  override nativeElement: ElementRef

  /**
   * Constructs a new instance of SqInputFileComponent.
   * @param validatorHelper - The ValidatorHelper service for input validation.
   * @param element - Reference to the native element.
   * @param translate - The TranslateService for translation support (optional).
   */
  constructor(
    public override validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public override translate: TranslateService,
  ) {
    super(validatorHelper, element, translate)
    this.nativeElement = element.nativeElement
  }

  /**
   * Asynchronously validate the file input value.
   * @param isBlur - Indicates if the input has lost focus.
   */
  override async validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && (!this.value || this.value.length < 1) && this.value !== 0) {
      this.setError('forms.required')
      this.valid.emit(false)
    } else if (this.maxSize && this.value && this.value.length > 0) {
      let bigFiles = 0
      for (const file of this.value) {
        if (file.size > this.maxSize) {
          bigFiles++
        }
      }
      if (bigFiles > 0) {
        this.setError('forms.fileSize')
        this.valid.emit(false)
      } else {
        this.valid.emit(true)
        this.error = ''
      }
    } else {
      this.valid.emit(true)
      this.error = ''
    }
    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  /**
   * Handle the change event for the file input.
   * @param event - The input change event.
   */
  override change(event: any): void {
    this.value = event.target?.files || event
    this.valueChange.emit(this.value)
    this.validate()
  }
}
