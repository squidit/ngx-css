# Pagination

## Inputs/Props

### 1. customClass

- description: Add custom class to the component
- type: `string`

### 2. currentPage

- description: Current page
- type: `number`
  
### 3. totalPages

- description: Total pages
- type: `number`

### 4. showPages

- description: Number of pages to show
- type: `number`

## Outputs

### 1. pageChange

- description: Emit when the pagination buttons is triggers
- type: `number`

## Example

```html
<sq-pagination
  [totalPages]='18'
  (pageChange)='nextPageStories($event)'
  [showPages]='5'
  [currentPage]='1'
><sq-pagination>
```
