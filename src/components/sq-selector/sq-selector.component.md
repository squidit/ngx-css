# Checkbox-Squid

> Checkbox

## Inputs/Props

1. name

- description: Set the name attribute HTML
- type: `string`

2. type (optional)

- description: Set the type of checkbox
- type: `( 'checkbox' | 'style' | 'tag' )`

3. checked (optional)

- description: Set the checked attribute HTML
- type: `boolean`

4. label

- description: Set the label
- type: `string`

5. id

- description: Set the id attribute HTML
- type: `string`

6. value (optional)

- description: Set the value attribute HTML
- type: `string`

7. disabled (optional)

- description: Set the disabled attribute HTML
- type: `string`

8. readonly (optional)

- description: Set the readonly attribute HTML
- type: `string`

9. required (optional)

- description: Set the required attribute HTML
- type: `string`

10. colorText (optional)

- description: Set the text inside de the box of input
- type: `string`
- default: `white`

11. colorBackground (optional)

- description: Set the background box color
- type: `string`
- default: `green`

12. hideInput

- description: Hide box input
- type: `boolean`
- default: `false`

13. block

- description: Block element to width 100%
- type: `boolean`
- default: `false`

## Outputs

1. sharedValue (optional)

- description: Function that passes the value to where the component is called (like one-way data-binding)
- type: `EventEmitter<{
  value: `string`,
  checked: `boolean`
}>`

## Example

```html
<checkbox-squid [id]='"your-id"' [name]='"your-name"'>
  <ng-template let-checked="checked" let-value="value" #rightLabel> Label </ng-template>
</checkbox-squid>
```
