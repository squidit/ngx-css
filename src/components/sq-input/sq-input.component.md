# Input Squid

> Custom input component

## Inputs/Props

1. type (optional)
  - description: Input HTML attribute type
  - type: `string`
  - value: `('text' | 'password' | 'email' | 'number' | 'textarea')`
  - default: `text`
  - obs: The type `textarea` transform the tag `<input />` into `<textarea></textarea>`

2. name (required)
  - description: Input HTML attribute name
  - type: `string`

3. id (required)
  - description: Input HTML attribute id
  - type: `string`

4. disabled (optional)
  - description: Input HTML attribute disabled and put a 'disabled' class 
  - type: `boolean`

5. readonly (optional)
  - description: Input HTML attribute disabled and put a 'readyonly' class 
  - type: `boolean`

6. required (optional)
  - description: Input HTML attribute id
  - type: `boolean`

7. color (optional)
  - description: Color preset string or hexadecimal color
  - type: `string`
  - default: `black`
  - presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry' | red-brandlovers)`

8. colorLabel (optional)
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

13. fullLabel (optional)
  - description: Show label with 100% of width
  - type: `boolean`
  - default: `false`

14. minNumber (optional)
  - description: `min` HTML attribute when `type` is `number`
  - type: `number | string`

15. maxNumber (optional)
  - description: `max` HTML attribute when `type` is `number`
  - type: `number | string`

16. hasBg (optional)
  - description: Show background white
  - type: `boolean`

17. tooltip (optional)
  - description: Tooltip bootstrap text
  - type: `string`

18. tooltipPlacement (optional)
  - description: Tooltip placement
  - type: `'top' | 'bottom' | 'left' | 'right'`

19. tooltipColor (optional)
  - description: Background color tooltip
  - type: `string`

20. tooltipInverted (optional)
  - description: Layout inverted tooltip
  - type: `string`

21. mask (optional)
  - description: ngx-mask string config
  - type: `string`

22. maxLength (optional)
  - description: Max length of value
  - type: `number | boolean | string`

## Outputs

1. sharedValue
  - description: Function that passes the value to where the component is called (like one-way data-binding)
  - type: `EventEmitter<any>`

2. sharedKeyPress
  - description: Return KeyDown event
  - type: `EventEmitter<any>`

3. sharedFocus
  - description: Return when input is onFocus
  - type: `EventEmitter<boolean>`

4. sharedEmail
  - description: Return email validation
  - type: `EventEmitter<boolean>`

5. sharedKeyPressUp
- description: Return KeyUp event
- type: `EventEmitter<any>`

## Example

  ```html
  <input-squid
    [name]='"email"'
    [id]='"email"'
    type='email'
    label='email'
    color='pink'
    [value]='myemail'
    [placeholder]='"Put your email here"'
    (sharedValue)="myemail = $event"
    required='true'
  ></input-squid>
  ```
