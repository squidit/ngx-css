# Tooltip-SQ

## Inputs/Props

### 1. color (optional)

- description: Set the icon color, preset or hexadecimal
- type: `string`

### 2. inverted (optional)

- description: Inverted the `?` icon
- type: `boolean`

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

## Outputs

## Example

```html
<sq-tooltip message="Oie" placement="left center" color="var(--pink)"></sq-tooltip>
```
