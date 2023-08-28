# Sq Tabs

Component that renders tabs

## Inputs/Props

### 1. height (optional)

- description: Tab Height
- type: `string`

### 2. maxWidth (optional)

- description: Max-width header
- type: `string`

### 3. margin (optional)

- description: Margin header
- type: `string`
- default: `0 auto`

### 4. lineStyle (optional)

- description: Change tab style, to line-style
- type: `bool`

## Outputs

### 1. tabChange

- description: Active Tab
- type: `{ tab: SqTabComponent, index: number }`

## Example

```html
<sq-tabs>
  <sq-tab title='Tab 1'>
    <h2>Content Tab</h2>
  </sq-tab>
  <sq-tab title='Tab 2'>
    <h2>Content Tab</h2>
  </sq-tab>
  <sq-tab title='Tab 3'>
    <h2>Content Tab</h2>
  </sq-tab>
  <sq-tab title='Tab 4'>
    <h2>Content Tab</h2>
  </sq-tab>
</sq-tabs>
```