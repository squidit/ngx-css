export interface Option {
  value: any
  label: string
  disabled?: boolean
}

export interface OptionMulti {
  label: string
  value: any
  disabled?: boolean
  children?: Array<OptionMulti>
  open?: boolean
}