import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SqInputFileComponent } from "./sq-input-file.component"
import { SqLoaderComponent, UniversalSafePipe, ValidatorHelper } from "src/public-api"
import { TranslateService } from "@ngx-translate/core"

describe('SqInputFileComponent', () => {
  let component: SqInputFileComponent
  let fixture: ComponentFixture<SqInputFileComponent>
  let translateService: jasmine.SpyObj<TranslateService>

  beforeEach(async () => {
    translateService = jasmine.createSpyObj('TranslateService', ['instant'])

    await TestBed.configureTestingModule({
      declarations: [SqInputFileComponent, UniversalSafePipe, SqLoaderComponent],
      providers: [
        ValidatorHelper,
        { provide: TranslateService, useValue: translateService }
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SqInputFileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should set the correct input type to "file"', () => {
    const inputElement = fixture.nativeElement.querySelector('input')
    expect(inputElement.type).toBe('file')
  })

  it('should validate file size and set an error if file exceeds maxSize', async () => {
    spyOn(component.valid, 'emit')
    component.maxSize = 1024 * 1024
    translateService.instant.and.returnValue('fileSize')
    const largeFile = new File(['x'.repeat(1024 * 1025)], 'largeFile.txt', { type: 'text/plain' })
    const smallFile = new File(['x'.repeat(1024 * 500)], 'smallFile.txt', { type: 'text/plain' })

    const mockEvent = {
      target: {
        files: [largeFile, smallFile]
      },
      length: 2
    }
    await component.change(mockEvent)
    fixture.detectChanges()

    expect(component.error).toBe('fileSize')
    expect(component.valid.emit).toHaveBeenCalledWith(false)
  })

  it('should not set an error if all files are within maxSize', () => {
    spyOn(component.valid, 'emit')
    component.maxSize = 1024 * 1024
    const smallFile = new File(['x'.repeat(1024 * 500)], 'smallFile.txt', { type: 'text/plain' })

    const mockEvent = {
      target: {
        files: [smallFile]
      }
    }

    component.change(mockEvent)
    fixture.detectChanges()

    expect(component.error).toBe('')
    expect(component.valid.emit).toHaveBeenCalledWith(true)
  })

  it('should set error if required and no file is uploaded', async () => {
    spyOn(component.valid, 'emit')
    translateService.instant.and.returnValue('required')
    component.required = true
    component.value = null

    await component.validate()
    fixture.detectChanges()

    expect(component.error).toBe('required')
    expect(component.valid.emit).toHaveBeenCalledWith(false)
  })

  it('should not set error if file is uploaded and required is true', () => {
    spyOn(component.valid, 'emit')
    component.required = true
    const file = new File(['content'], 'file.txt', { type: 'text/plain' })
    component.value = [file]

    component.validate()
    fixture.detectChanges()

    expect(component.error).toBe('')
    expect(component.valid.emit).toHaveBeenCalledWith(true)
  })

  it('should emit valid event when validation passes', () => {
    spyOn(component.valid, 'emit')

    const file = new File(['content'], 'file.txt', { type: 'text/plain' })
    component.maxSize = 1024 * 1024
    const mockEvent = { target: { files: [file] } }

    component.change(mockEvent)
    fixture.detectChanges()

    expect(component.valid.emit).toHaveBeenCalledWith(true)
  })

  it('should apply error class when there is an externalError', () => {
    component.externalError = 'Invalid file'
    fixture.detectChanges()

    const wrapperElement = fixture.nativeElement.querySelector('.wrapper-input-file-squid')
    expect(wrapperElement.classList).toContain('error')
  })

  it('should apply block class when block input is true', () => {
    component.block = true
    fixture.detectChanges()

    const wrapperElement = fixture.nativeElement.querySelector('.wrapper-input-file-squid')
    expect(wrapperElement.classList).toContain('block')
  })

  it('should apply loading class to label when loading is true', () => {
    component.loading = true
    component.label = 'File Upload'
    fixture.detectChanges()

    const labelElement = fixture.nativeElement.querySelector('.label')
    expect(labelElement.classList).toContain('loading')
  })

  it('should render placeholder with correct styles', () => {
    component.placeholder = 'Upload a file'
    component.textColor = '#ffffff'
    component.color = '#000000'
    component.fontSize = '16px'
    fixture.detectChanges()

    const placeholderLabel = fixture.nativeElement.querySelector('.placeholder')
    expect(placeholderLabel.innerText).toBe('Upload A File')
    expect(placeholderLabel.style.color).toBe('rgb(255, 255, 255)')
    expect(placeholderLabel.style.backgroundColor).toBe('rgb(0, 0, 0)')
    expect(placeholderLabel.style.fontSize).toBe('16px')
  })

  it('should emit valueChange when a file is selected', () => {
    spyOn(component.valueChange, 'emit')

    const file = new File(['content'], 'file.txt', { type: 'text/plain' })
    const mockEvent = { target: { files: [file] } }

    component.change(mockEvent)
    fixture.detectChanges()

    expect(component.valueChange.emit).toHaveBeenCalledWith([file])
  })

  it('should disable input when loading is true', () => {
    component.loading = true
    fixture.detectChanges()

    const inputElement = fixture.nativeElement.querySelector('input[type="file"]')
    expect(inputElement.disabled).toBeTrue()
  })

  it('should render sq-loader when loading is true', () => {
    component.loading = true
    fixture.detectChanges()

    const loaderElement = fixture.nativeElement.querySelector('sq-loader')
    expect(loaderElement).toBeTruthy()
  })

  it('should call keyDown on input keydown event', () => {
    spyOn(component, 'keyDown')
    const inputElement = fixture.nativeElement.querySelector('input[type="file"]')

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    inputElement.dispatchEvent(event)

    fixture.detectChanges()
    expect(component.keyDown).toHaveBeenCalled()
  })
})