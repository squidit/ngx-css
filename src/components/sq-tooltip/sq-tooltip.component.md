# Tooltip-SQ

## Inputs/Props

### 1. color (optional)

- description: Set the icon color, preset or hexadecimal
- type: `string`

### 2. tooltipClass

- description: Set tooltip Class
- type: `string`

### 3. placement (optional)

- description: Set the tooltip direction
- type: `string`
- default: `top`
- value: `('top' | 'left' | 'bottom' | 'right')`

### 4. message

- description: Set tooltip message
- type: `string`

### 5. icon

- description: add custom icon, you should use the HTML tag. eg.`<i class="fas fa-search-plus"></i>`
- type: `string`

### 6. textAlign

- description: Text align tooltip Class
- type: `string`
- default: `text-center`

### 4. fontSize

- description: Set tooltip font size
- type: `string`

## Outputs

## Example

```html
<sq-tooltip message="Hello" placement="left center" color="var(--pink)"></sq-tooltip>
```
