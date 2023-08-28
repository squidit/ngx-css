# Infinity Scroll

> Component that performs infinite scroll with requests for api with pagination

## Inputs/Props

### 1. length

- description: Total Items Size
- type: `number`

### 2. loading (optional)

- description: Show infinityScroll loader.
- type: `boolean | string`

### 3. endMessage (optional)

- description: Message displayed when there are no more pages.
- type: `string`

### 4. hasMore (optional)

- description: It passes to the component if there are more pages to be ordered.
- type: `boolean | string`

### 5. loaderColor (optional)

- description: Loader color preset string or hexadecimal color
- type: `string`
- default: `black`
- presets: `('black' | 'white' | 'silver' | 'gray' | 'pink' | 'red' | 'pomegranate' | 'lilac' | 'blue' | 'cian' | 'lemon' | 'gold' | 'pastry')`

### 6. elementToScrollId(optional)

- description: ID of element to be scrolled
- type: `string`
- default: `window` (JavaScript DOM window element)

## Outputs

### 1. scrolledEmitter

- description: Send the parent to do a new request.

## Example

```html
<sq-infinity-scroll
  [length]='items.length'
  [endMessage]='No more content'
  [hasMore]='!!items.nextPage'
  (scrolledEmitter)='getItems()'
>
  Content
</sq-infinity-scroll>
```
