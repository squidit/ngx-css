import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ChangeDetectorRef, ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { SqSelectSearchComponent } from './sq-select-search.component'
import { Option } from '../../interfaces/option.interface'
import {
  SearchFromAlternativeArrayPipe,
  SqClickOutsideDirective,
  SqInfinityComponent,
  TranslateInternalPipe
} from 'src/public-api'
import { FormsModule } from '@angular/forms'

describe('SqSelectSearchComponent', () => {
  let component: SqSelectSearchComponent
  let fixture: ComponentFixture<SqSelectSearchComponent>
  let elementRef: ElementRef
  let translateService: jasmine.SpyObj<TranslateService>
  let changeDetectorRef: ChangeDetectorRef

  beforeEach(async () => {
    elementRef = new ElementRef(document.createElement('div'))
    translateService = jasmine.createSpyObj('TranslateService', ['instant', 'get'])
    translateService.instant.and.callFake((key: string) => key)
    changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges'])

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        SqSelectSearchComponent,
        SqClickOutsideDirective,
        TranslateInternalPipe,
        SqInfinityComponent,
        SearchFromAlternativeArrayPipe
      ],
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: TranslateService, useValue: translateService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SqSelectSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit valueChange and close dropdown on emit', () => {
    spyOn(component.valueChange, 'emit')
    spyOn(component, 'closeDropdown')
    const option: Option = { value: 'test', label: 'Test' }
    component.emit(option)
    expect(component.value).toBe(option)
    expect(component.valueChange.emit).toHaveBeenCalledWith(option)
    expect(component.closeDropdown).toHaveBeenCalled()
  })

  it('should validate correctly', fakeAsync(() => {
    spyOn(component.valid, 'emit')
    component.required = true
    component.value = undefined
    component.validate()
    tick(300)
    expect(component.error).toBe('forms.required')
    expect(component.valid.emit).toHaveBeenCalledWith(false)

    component.value = { value: 'test', label: 'Test' }
    component.validate()
    expect(component.error).toBe('')
    expect(component.valid.emit).toHaveBeenCalledWith(true)

    component.externalError = 'Error'
    component.validate()
    expect(component.error).toBeFalse()
  }))

  it('should handle dropdown action correctly', async () => {
    spyOn(component, 'addMoreOptions')
    spyOn(component, 'closeDropdown')
    component.open = true
    await component.doDropDownAction()
    fixture.detectChanges()

    expect(component.closeDropdown).toHaveBeenCalled()
    expect(component.renderOptionsList).toBeFalse()

    component.open = false
    await component.doDropDownAction()
    fixture.detectChanges()

    expect(component.addMoreOptions).toHaveBeenCalled()
    expect(component.renderOptionsList).toBeTrue()
  })

  it('should close dropdown correctly', () => {
    component.closeDropdown()
    expect(component.open).toBeFalse()
    expect(component._options.length).toBe(0)
    expect(component.limit).toBe(component.quantity)
    expect(component.hasMoreOptions).toBeTrue()
    expect(component.searchText).toBe('')
  })

  it('should track options by value', () => {
    const option: Option = { value: 'test', label: 'Test' }
    expect(component.trackByOptValue(0, option)).toBe('test')
  })

  it('should handle search input changes correctly', fakeAsync(() => {
    spyOn(component.searchChange, 'emit')
    component.timeToChange = 300
    component.minCharactersToSearch = 3
    component.onTipSearchChange('te')
    tick(300)
    expect(component.searchChange.emit).not.toHaveBeenCalled()

    component.onTipSearchChange('test')
    tick(300)
    expect(component.searchChange.emit).toHaveBeenCalledWith('test')
  }))

  it('should set error message correctly', async () => {
    (translateService.instant as jasmine.Spy).and.returnValue('Required')
    await component.setError('forms.required')
    expect(component.error).toBe('Required')
  })

  it('should add more options correctly', () => {
    component.options = Array.from({ length: 30 }, (_, i) => ({ value: `option${i}`, label: `Option ${i}` }))
    component.addMoreOptions()
    expect(component._options.length).toBe(component.quantity)
    expect(component.hasMoreOptions).toBeTrue()

    component.addMoreOptions()
    expect(component._options.length).toBe(component.quantity * 2)
    expect(component.hasMoreOptions).toBeFalse()
  })

  it('should handle ngOnChanges correctly', async () => {
    spyOn(component, 'addMoreOptions')
    component.open = true
    await component.ngOnChanges({ options: { currentValue: [], previousValue: [], firstChange: true, isFirstChange: () => true } })
    expect(component.addMoreOptions).toHaveBeenCalledWith(true)
  })
})