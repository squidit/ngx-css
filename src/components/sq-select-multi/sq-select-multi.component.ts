import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateService } from '@ngx-translate/core';
import { useMemo } from '../../helpers/memo.helper';
import { OptionMulti } from '../../interfaces/option.interface';
import { SqLoaderComponent } from '../sq-loader/sq-loader.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { SqSelectorComponent } from '../sq-selector/sq-selector.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { TranslateInternalPipe } from '../../pipes/translate-internal/translate-internal.pipe';
import { SearchPipe } from '../../pipes/search/search.pipe';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';
import { SearchValidValuesPipe } from 'src/pipes/search-valid-values/search-valid-values.pipe';

/**
 * Multi-select dropdown component with advanced features including:
 * - Single or multiple selection
 * - Search/filter functionality
 * - Hierarchical options (nested children)
 * - Custom templates
 * - Virtual scrolling for large lists
 *
 * @example
 * <sq-select-multi
 *   [options]="cities"
 *   [(value)]="selectedCities"
 *   [maxSelects]="3"
 *   [width]="'300px'"
 *   [minWidth]="'250px'"
 *   [dropdownWidth]="'350px'"
 * ></sq-select-multi>
 */
@Component({
  selector: 'sq-select-multi',
  templateUrl: './sq-select-multi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sq-select-multi.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    AsyncPipe,
    FormsModule,
    ScrollingModule,
    SqLoaderComponent,
    SqTooltipComponent,
    SqSelectorComponent,
    UniversalSafePipe,
    TranslateInternalPipe,
    SearchPipe,
    SearchValidValuesPipe,
    SqClickOutsideDirective,
  ],
  providers: [],
})
export class SqSelectMultiComponent implements OnChanges {
  // #region Input Properties

  /**
   * Name attribute for the select element.
   * Defaults to a random unique name if not provided.
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`;

  /**
   * Currently selected options (two-way bindable).
   */
  @Input() value: OptionMulti[] = [];

  /**
   * ID attribute for the select element.
   */
  @Input() id?: string;

  /**
   * Label text displayed above the select input.
   */
  @Input() label = '';

  /**
   * Custom CSS class to apply to the component container.
   */
  @Input() customClass = '';

  /**
   * Placeholder text shown when no options are selected.
   */
  @Input() placeholder = '';

  /**
   * External error message to display.
   */
  @Input() externalError = '';

  /**
   * External icon to display.
   */
  @Input() externalIcon = '';

  /**
   * Placeholder text for the search input.
   */
  @Input() placeholderSearch = '';

  /**
   * Disables the select input when true.
   */
  @Input() disabled = false;

  /**
   * Makes the select input read-only when true.
   */
  @Input() readonly = false;

  /**
   * Marks the field as required when true.
   */
  @Input() required = false;

  /**
   * Shows loading spinner when true.
   */
  @Input() loading = false;

  /**
   * Enables form error messages when true.
   */
  @Input() useFormErrors = true;

  /**
   * Shows error message container when true.
   */
  @Input() errorSpan = true;

  /**
   * Background color for the select input.
   */
  @Input() backgroundColor = '';

  /**
   * Border color for the select input.
   */
  @Input() borderColor = '';

  /**
   * Color for the label text.
   */
  @Input() labelColor = '';

  /**
   * Minimum characters required to trigger search.
   */
  @Input() minCharactersToSearch = 0;

  /**
   * Debounce time (in ms) for search input.
   */
  @Input() timeToChange = 800;

  /**
   * Array of available options for selection.
   */
  @Input() options: Array<OptionMulti> = [];

  /**
   * Maximum number of items that can be selected.
   */
  @Input() maxSelects?: number;

  /**
   * Minimum number of items required to be selected.
   */
  @Input() minSelects?: number;

  /**
   * Shows selected items inside the input when true.
   */
  @Input() showInside = true;

  /**
   * Hides the search input when true.
   */
  @Input() hideSearch = false;

  /**
   * Tooltip message content.
   */
  @Input() tooltipMessage = '';

  /**
   * Position of the tooltip relative to the label.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center';

  /**
   * Color scheme for the tooltip.
   */
  @Input() tooltipColor = 'inherit';

  /**
   * Icon to display with the tooltip.
   */
  @Input() tooltipIcon = '';

  /**
   * Width of the component container.
   * Can be any valid CSS width value (px, %, etc).
   * Default: '100%'
   */
  @Input() width = '100%';

  /**
   * Minimum width of the component container.
   * Default: '200px'
   */
  @Input() minWidth = '200px';

  /**
   * Width of the dropdown panel.
   * Can be different from the trigger width.
   * Default: '100%'
   */
  @Input() dropdownWidth = '100%';

  // #endregion

  // #region Output Events

  /**
   * Emitted when the selected values change.
   */
  @Output() valueChange: EventEmitter<Array<OptionMulti>> = new EventEmitter();

  /**
   * Emitted when the search text changes (with debounce).
   */
  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  /**
   * Emitted when the dropdown closes.
   * Contains boolean indicating if selection changed.
   */
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Emitted when validation status changes.
   * True when valid, false when invalid.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  // #endregion

  // #region Content Projection

  /**
   * Custom template for the label content.
   */
  @ContentChild('labelTemplate') labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Custom template to display when no options are available.
   */
  @ContentChild('selectEmptyTemplate') selectEmptyTemplate: TemplateRef<HTMLElement> | null = null;

  // #endregion

  // #region Internal State

  /**
   * Flag indicating whether the rendering of the options list is active
   * @internal
   */
  renderOptionsList = false;

  /**
   * State that controls whether the dropdown is open or closed
   * @internal
   */
  open = false;

  /**
   * Current text used for search/filter
   * @internal
   */
  searchText = '';

  /**
   * Flag indicating whether the value has changed since the last opening
   * @internal
   */
  valueChanged = false;

  /**
   * Temporary flag for timeout control
   * @internal
   */
  timeouted = false;

  /**
   * Current error message or error boolean state
   * @internal
   */
  error: boolean | string = '';

  /**
   * Reference to the native element of the component
   * @internal
   */
  nativeElement: ElementRef;

  /**
   * Internal list of options after filters are applied
   * @internal
   */
  _options: Array<OptionMulti> = [];

  /**
   * Flag indicating whether the maximum number of selections has been reached
   * @internal
   */
  ismaxSelects = false;

  /**
   * Reference to the search timeout for debounce
   * @internal
   */
  timeoutInput!: ReturnType<typeof setTimeout>;

  /**
   * Dynamic height of the virtual scroll viewport
   * Automatically calculated based on the number of options
   * @internal
   */
  cdkVirtualScrollViewportHeight = '305px';

  /**
   * Size of the items in the virtual scroll (in pixels)
   * @internal
   */
  cdkItemSize: string | null = '32';

  // #endregion

  /**
   * Constructor for the SqSelectMultiComponent.
   * Initializes the component with default values and dependencies.
   * @param element - ElementRef for accessing native DOM element
   * @param translate - Optional TranslateService for internationalization
   * @param changeDetector - ChangeDetectorRef for manual change detection
   */
  // #region Constructor
  constructor(
    public element: ElementRef,
    @Optional() private translate: TranslateService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.nativeElement = element.nativeElement;
  }
  // #endregion

  // #region Lifecycle Methods

  /**
   * Angular lifecycle hook called when input properties change.
   * @param changes - Object containing changed properties.
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (this.open && changes.hasOwnProperty('options')) {
      this.verifyNewOptions();
    }
    if (
      changes.hasOwnProperty('value') ||
      changes.hasOwnProperty('minSelects') ||
      changes.hasOwnProperty('maxSelects')
    ) {
      this.validate();
    }
  }

  // #endregion

  // #region Public Methods

  /**
   * Toggles the dropdown open/closed state.
   * Handles animations and rendering of options list.
   */
  async doDropDownAction() {
    if (this.open) {
      this.closeDropdown();
      this.renderOptionsList = await new Promise<boolean>(resolve =>
        setTimeout(() => {
          resolve(false);
        }, 300)
      );
      this.changeDetector.detectChanges();
    } else {
      this.verifyNewOptions();
      this.renderOptionsList = true;
      this.open = await new Promise<boolean>(resolve =>
        setTimeout(() => {
          resolve(true);
        }, 100)
      );
      this.changeDetector.detectChanges();
    }
  }

  /**
   * Closes the dropdown and resets search state.
   */
  closeDropdown() {
    this.open = false;
    this._options = [];
    this.searchText = '';
    this.closeChange.emit(this.valueChanged);
    this.valueChanged = false;
  }

  /**
   * Handles expanding/collapsing of hierarchical options.
   * @param item - The option item to toggle
   */
  handleCollapse(item: OptionMulti) {
    item.open = !item.open;
    if (item.children) {
      if (this.options.find(option => option.open) || item.open) {
        this.cdkItemSize = null;
      } else {
        this.cdkItemSize = '32';
      }
    }
  }

  // #endregion

  // #region Selection Methods

  /**
   * Determines if an item exists in the selected values.
   * @param item - The item to check
   * @param value - Optional array to check against (defaults to current value)
   * @returns True if the item is selected
   */
  findItemInValue = useMemo((item: OptionMulti, value?: Array<OptionMulti>) => {
    return !!value?.find(value => value.value === item.value);
  });

  /**
   * Checks if any options have children (hierarchy).
   * @param options - Array of options to check
   * @returns True if any option has children
   */
  verifyIfOptionsHasChildren = useMemo((options: OptionMulti[]) => {
    return options.some(item => item.children?.length);
  });

  /**
   * Checks if an item has any selected children.
   * @param item - The parent item to check
   * @param value - Optional array to check against (defaults to current value)
   * @returns True if any child is selected
   */
  verifyIfHasChildrenInValue = useMemo((item: OptionMulti, value?: Array<OptionMulti>) => {
    if (item.children?.length) {
      const hasAllChildren = item.children.every(child => this.findItemInValue(child, value));
      if (hasAllChildren && !this.findItemInValue(item, value) && !this.timeouted) {
        this.timeouted = true;
        setTimeout(() => {
          this.emit(item, true);
          this.timeouted = false;
        }, 0);
      }
      return !!item.children.find(child => this.findItemInValue(child, value));
    }
    return false;
  });

  /**
   * Adds or removes an item from the selection.
   * @param object - The option to select/deselect
   * @param checked - True to select, false to deselect
   */
  emit(object: OptionMulti, checked: boolean) {
    if (checked) {
      this.value?.push(object);
    } else {
      this.value = this.value?.filter(item => item.value !== object.value);
      if (object.children?.length) {
        object.children.forEach(item => {
          this.value = this.value?.filter(child => child.value !== item.value);
        });
      }
    }
    this.valueChanged = true;
    this.valueChange.emit(this.value);
    this.validate();
  }

  // #endregion

  // #region Validation

  /**
   * Validates the current selection state.
   * Updates error messages and validity status.
   */
  validate() {
    if (this.externalError) {
      this.error = false;
    } else if (this.required && !this.value?.length) {
      this.setError('forms.required');
      this.valid.emit(false);
    } else if (this.minSelects && this.value && this.value?.length < this.minSelects) {
      this.setError('forms.minimumRequired', { minSelects: this.minSelects });
      this.valid.emit(false);
    } else if (this.maxSelects && this.value && this.value?.length === this.maxSelects) {
      this.renderOptionsList = false;
      this.ismaxSelects = true;
      this.error = '';
      this.valid.emit(true);
    } else {
      this.ismaxSelects = false;
      this.error = '';
      this.valid.emit(true);
    }
  }

  /**
   * Sets an error message using translation.
   * @param key - Translation key for the error
   * @param interpolateParams - Optional interpolation parameters
   */
  async setError(key: string, interpolateParams: Object = {}) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key, interpolateParams);
    }
  }

  // #endregion

  // #region Search & Filtering

  /**
   * Handles search input changes with debounce.
   * @param event - The new search text
   */
  async modelChange(event: any) {
    if (!this.minCharactersToSearch || !event.length || event.length >= this.minCharactersToSearch) {
      clearTimeout(this.timeoutInput);
      this.searchText =
        (await new Promise<string>(
          resolve =>
            (this.timeoutInput = setTimeout(() => {
              resolve(event);
            }, this.timeToChange))
        )) || '';
      this.searchChange.emit(event);
      this.changeDetector.detectChanges();
    }
  }

  // #endregion

  // #region Virtual Scroll Helpers

  /**
   * Updates options list and calculates virtual scroll viewport height.
   * Adjusts based on number of options for optimal performance.
   */
  verifyNewOptions() {
    this._options = this.options;
    if (!this._options.length) {
      this.cdkVirtualScrollViewportHeight = '16px';
    } else if (this._options.length < 15) {
      this.cdkVirtualScrollViewportHeight = this._options.length * 32 + 'px';
    } else {
      this.cdkVirtualScrollViewportHeight = '305px';
    }
  }

  /**
   * TrackBy function for ngFor optimizations.
   * @param index - Item index
   * @param opt - Option item
   * @returns Unique identifier for the item
   */
  trackByOptValue: TrackByFunction<any> = useMemo((index, opt) => opt.value);

  // #endregion
}
