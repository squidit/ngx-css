# Button-Squid

> Component that renders a standard Button Squid

## Inputs/Props

### 1. type (optional)

- description: Button attribute type
- type: `string`
- value: `('button' | 'submit')`
- default: `button`

### 2. clickFunction (optional)

- description: Button click function
- type: `any`

### 3. fontSize (optional)

- description: Button font-size
- type: `string`

### 4. color (optional)

- description: Button color preset string or hexadecimal color
- type: `string`
- default: `black`
- presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry' | 'red-brandlovers')`

### 5. textColor (optional)

- description: Button color text color
- type: `string`

### 6. disabled (optional)

- description: Input HTML attribute disabled and put a 'disabled' class
- type: `boolean`

### 7. loading (optional)

- description: Put a 'loading' class
- type: `boolean`

### 8. block (optional)

- description: Put a 'block' class that fix the button width to 100%
- type: `boolean`

### 9. noPadding (optional)

- description: Set padding: 0;
- type: `boolean`

### 10. hideOnLoading (optional)

- description: Hide content on loading
- type: `boolean`

### 11. borderColor (optional)

- description: Button border color preset string or hexadecimal color
- type: `string`
- default: `black`
- presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry')`

### 12. buttonAsLink (optional)

- description: Style of button is removed and text stay with underline
- type: `boolean`

### 13. id (optional)

- description: Input HTML attribute id
- type: `string`

### 14. textTransform (optional)

- description: Text case
- type: `string`

## Outputs

### 1. emitClick

- description: Emit when button is clicked
- type: `MouseEvent`

## Example

```html
<sq-button color="var(--pink)" [disabled]="disabled" (emitClick)="yourFunc()"> Click me! </sq-button>
```
