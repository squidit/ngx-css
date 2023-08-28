# Progress Bar

## Inputs/Props

### 1. color (optional)

- description: Progress bar color
- type: `string`
- default: `black`

### 2. hasLabel (optional)

- description: Show % on load
- type: `boolean`

### 3. value

- description: Value os progress. 0 to 100
- type: `number | string`

### 4. height (optional)

- description: Bat height
- type: `string`
- default: `16px`

### 5. striped (optional)

- description: Strip bar
- type: `boolean`
- default: `true`

### 6. animated  (optional)

- description: Animate strip bars
- type: `boolean`
- default: `true`

## Outputs

## Example

```html
<sq-progress-bar
  color='gold'
  [value]='50'
  [hasLabel]='true'
></sq-progress-bar>
```
