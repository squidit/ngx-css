# Select Squid

> Custom select component

## Inputs/Props

1. options

- description: Array of '<options>'
- type: `Array<{
  value: any,
  label: string,
  disabled?: boolean
}>`
  object per item description:
  - **value**: Value attr on option tag.
  - **label**: string inside option tag.
  - **disabled**: Disabled item to select
- type: `SelectionOptionSquid` [SelectionOptionSquid](../../models/selection-option-squid.model.ts)

2. name (required)

- description: Input HTML attribute name
- type: `string`

3. id (required)

- description: Input HTML attribute id
- type: `string`

4. disabled (optional)

- description: Input HTML attribute disabled and put a 'disabled' class
- type: `boolean`

5. required (optional)

- description: Input HTML attribute id
- type: `boolean`

6. color (optional)

- description: Color preset string or hexadecimal color
- type: `string`
- default: `black`
- presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry')`

7. colorLabel (optional)

- description: Color preset string or hexadecimal color label string
- type: `string`
- default: `black`
- presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry')`

8. placeholder (optional)

- description: Input HTML attribute placeholder
- type: `string`

9. label (optional)

- description: Append a `<label>` tag before input
- type: `string`

10. value (optional)

- description: Input HTML attribute value and ngModel
- type: `string`

11. validateIcons (optional)

- description: Shows graphic field validations
- type: `boolean`
- default: `true`

12. errorSpan (optional)

- description: Show span error
- type: `boolean`
- default: `true`

13. loading (optional)

- description: Define if select are loading
- type: `boolean`
- default: `false`

14. readonly (optional)

- description: readonly html
- type: `boolean`

15. optionsWithGroups

- description: Options with optgroup tag
- type: `Array<{
  label: string
  options: Array<{
    value: any
    label: string
    disabled?: boolean
  }>
}>`

## Outputs

1. sharedValue (optional)

- description: Function that passes the value to where the component is called (like one-way data-binding)
- type: `EventEmitter<any>`

2. sharedFocus

- description: Return when input is onFocus
- type: `EventEmitter<boolean>`

## Example

```html
<select-squid
  [name]='"select"'
  [id]='"select"'
  [label]="label"
  (sharedValue)="sharedValue($event)"
  [value]="value"
  [options]="options"
></select-squid>
```
