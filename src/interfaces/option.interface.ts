/**
 * Represents an option with a value and label.
 * @interface
 */
export interface Option {
  /**
   * The value associated with the option.
   */
  value: any

  /**
   * The label to display for the option.
   */
  label: string

  /**
   * (Optional) Indicates if the option is disabled.
   */
  disabled?: boolean

  /**
   * (Optional) Additional data
   */
  data?: any
}

/**
 * Represents a multi-select option with a label, value, and optional children.
 * @interface
 */
export interface OptionMulti {
  /**
   * The label to display for the option.
   */
  label: string

  /**
   * The value associated with the option.
   */
  value: any

  /**
   * (Optional) Indicates if the option is disabled.
   */
  disabled?: boolean

  /**
   * (Optional) An array of child options for this multi-select option.
   */
  children?: Array<OptionMulti>

  /**
   * (Optional) Indicates whether the option's children should be displayed (open) in a dropdown.
   */
  open?: boolean

  /**
   * (Optional) Additional data
   */
  data?: any
}
