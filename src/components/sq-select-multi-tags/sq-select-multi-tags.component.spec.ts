import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ChangeDetectorRef, ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { SqSelectMultiTagsComponent } from './sq-select-multi-tags.component'
import { OptionMulti } from '../../interfaces/option.interface'
import { SearchFromAlternativeArrayPipe, SqClickOutsideDirective, SqInfinityComponent, TranslateInternalPipe } from 'src/public-api'
import { FormsModule } from '@angular/forms'

describe('SqSelectMultiTagsComponent', () => {
  let component: SqSelectMultiTagsComponent
  let fixture: ComponentFixture<SqSelectMultiTagsComponent>
  let elementRef: ElementRef
  let mockTranslateService: jasmine.SpyObj<TranslateService>
  let changeDetectorRef: ChangeDetectorRef

  beforeEach(async () => {
    elementRef = new ElementRef(document.createElement('div'))
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant', 'get'])
    mockTranslateService.instant.and.callFake((key: string) => key)
    changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges'])

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        SqSelectMultiTagsComponent,
        SqClickOutsideDirective,
        SqInfinityComponent,
        SearchFromAlternativeArrayPipe,
        TranslateInternalPipe
      ],
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SqSelectMultiTagsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with default values', () => {
    expect(component.name).toContain('random-name-')
    expect(component.value).toEqual([])
    expect(component.label).toBe('')
    expect(component.customClass).toBe('')
    expect(component.placeholder).toBe('')
    expect(component.externalError).toBe('')
    expect(component.externalIcon).toBe('')
    expect(component.placeholderSearch).toBe('')
    expect(component.disabled).toBe(false)
    expect(component.readonly).toBe(false)
    expect(component.required).toBe(false)
    expect(component.loading).toBe(false)
    expect(component.useFormErrors).toBe(true)
    expect(component.errorSpan).toBe(true)
    expect(component.backgroundColor).toBe('')
    expect(component.borderColor).toBe('')
    expect(component.labelColor).toBe('')
    expect(component.minCharactersToSearch).toBe(0)
    expect(component.timeToChange).toBe(800)
    expect(component.options).toEqual([])
    expect(component.showInside).toBe(true)
    expect(component.hideSearch).toBe(false)
    expect(component.tooltipMessage).toBe('')
    expect(component.tooltipPlacement).toBe('right center')
    expect(component.tooltipColor).toBe('inherit')
    expect(component.tooltipIcon).toBe('')
  })

  it('should emit searchChange when search text changes', async () => {
    spyOn(component.searchChange, 'emit')
    const searchText = 'test'
    await component.modelChange(searchText)
    expect(component.searchChange.emit).toHaveBeenCalledWith(searchText)
  })

  it('should emit closeChange when dropdown is closed', () => {
    spyOn(component.closeChange, 'emit')
    component.closeDropdown()
    expect(component.closeChange.emit).toHaveBeenCalledWith(false)
  })

  it('should emit removeTag when a tag is removed', () => {
    spyOn(component.removeTag, 'emit')
    const tag: OptionMulti = { value: '1', label: 'Option 1' }
    component.value = [tag]
    component.removeItem(tag, null)
    expect(component.removeTag.emit).toHaveBeenCalledWith(tag)
  })

  it('should validate required field', async () => {
    component.required = true
    component.value = []
    await component.validate()
    expect(component.error).toBe('forms.required')
  })

  it('should validate minTags', async () => {
    component.minTags = 2
    component.value = [{ value: '1', label: 'Option 1' }]
    await component.validate()
    expect(component.error).toBe('forms.minimumRequired')
  })

  it('should validate maxTags', () => {
    component.maxTags = 1
    component.value = [{ value: '1', label: 'Option 1' }]
    component.validate()
    expect(component.isMaxTags).toBe(true)
  })

  it('should track by option value', () => {
    const option = { value: '1', label: 'Option 1' }
    expect(component.trackByOptValue(0, option)).toBe('1')
  })

  it('should add more options', () => {
    component.options = Array.from({ length: 30 }, (_, i) => ({ value: `${i}`, label: `Option ${i}` }))
    component.addMoreOptions()
    expect(component._options.length).toBe(15)
  })

  it('should handle collapse', () => {
    const item: OptionMulti = { value: '1', label: 'Option 1', open: false }
    component.handleCollapse(item)
    expect(item.open).toBe(true)
  })

  it('should set error message', async () => {
    (mockTranslateService.instant as jasmine.Spy).and.returnValue('Error message')
    await component.setError('error.key')
    expect(component.error).toBe('Error message')
  })

  it('should find item in value', () => {
    const item: OptionMulti = { value: '1', label: 'Option 1' }
    component.value = [item]
    expect(component.findItemInValue(item, component.value)).toBe(true)
  })

  it('should verify if options have children', () => {
    const options: OptionMulti[] = [{ value: '1', label: 'Option 1', children: [{ value: '1.1', label: 'Child 1' }] }]
    expect(component.verifyIfOptionsHasChildren(options)).toBe(true)
  })

  it('should verify if item has children in value', () => {
    const item: OptionMulti = { value: '1', label: 'Option 1', children: [{ value: '1.1', label: 'Child 1' }] }
    component.value = [{ value: '1.1', label: 'Child 1' }]
    expect(component.verifyIfHasChildrenInValue(item, component.value)).toBe(true)
  })

  it('should emit value change when item is checked', () => {
    spyOn(component.valueChange, 'emit')
    const item: OptionMulti = { value: '1', label: 'Option 1' }
    component.emit(item, true)
    expect(component.valueChange.emit).toHaveBeenCalledWith([item])
  })

  it('should emit value change when item is unchecked', () => {
    spyOn(component.valueChange, 'emit')
    const item: OptionMulti = { value: '1', label: 'Option 1' }
    component.value = [item]
    component.emit(item, false)
    expect(component.valueChange.emit).toHaveBeenCalledWith([])
  })
})