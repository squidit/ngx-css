# Steps

## Inputs/Props

### 1. color

- description: Color active
- type: `string`
- default: `#e83e8c`

### 2. click

- description: Activate click function to change step ative
- type: `boolean`

### 3. active

- description: Index of steps to active
- type: `number`

### 4. steps

- description: Array of steps, tip is a ngTooltip to do a short description
- type: `Array<{
    tip?: string,
    status: string
  }>`

## Outputs

### 1. emitClick

- description: Return when step is clicked.
- type: `{
    step: {
      tip: string,
      status: string
    },
    i: number
  }`

## Example

```html
<sq-steps [steps]="steps" [active]="1"></sq-steps>
```
