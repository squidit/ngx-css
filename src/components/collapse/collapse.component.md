# Collapse

> Collapse component, base for an Accordion among other uses

## Inputs/Props

1. header (optional)
  - description: Defines whether the collapse has a header. The Header must be set inside a <ng-template #header>
  - type: `boolean`

2. color (optional)
  - description: Header Background color preset string or hexadecimal color
  - type: `string`
  - default: `cian`
  - presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry')`

3. colorIcons (optional)
  - description: Icons color preset string or hexadecimal color
  - type: `string`
  - default: `black`
  - presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry')`

4. disabled (optional)
  - description: Input HTML attribute disabled and put a 'disabled' class 
  - type: `boolean`

5. loading (optional)
  - description: Put a 'loading' class 
  - type: `boolean`

6. open (optional)
  - description: Put a 'open' class and opene the collapse
  - type: `boolean`

7. class (optional)
  - description: Class Wrapper
  - type: `string`

8. colorBackgroundIcon (optional)
  - description: background and hover icon
  - type: `string`

9. fontSizeIcon (optional)
  - description: Font-size icon
  - type: `string`

10. heightIcon (optional)
  - description: height and line-height icon
  - type: `string`

## Outputs

1. openedEmitter
  - description: Triggers an event that says whether the collapse is open or closed
  - type: `{
    open: boolean,
    element: HTML element clicked
  }`

## Example

```html
<collapse
  [header]='true'
  color='pink'
  [open]='true'
  [loading]='false'
  [disabled]='false'
>
  <ng-template #header>
    Header Collapse HTML
  </ng-template>
 <div class='content'>
   contente here
 </div>
</collapse>
```