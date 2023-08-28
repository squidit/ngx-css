# Universal Safe Pipe

## Esse pipe é utilizado para maior produtividade e reutilização do código através do sanitizer


## Inputs/Props

1. SafeHtml
  - how to use:  [innerHtml]="htmlSnippet | universalSafe: 'html'"
  - description: Safe HTML.
  - type: `string`

2.  SafeStyle
  - how to use:  [style]="style | universalSafe: 'style'"
  - description: Safe Style.
  - type: `string`

3.  SafeScript
  - how to use:  " | universalSafe: 'script'"
  - description: Safe Script
  - type: string

4.  SafeUrl
  - how to use:  [src]="url | universalSafe: 'url'"
  - description: Safe Url Link
  - type: `string`

5.  SafeResourceUrl
  - how to use:  [src]="resourceUrl | universalSafe: 'resourceUrl'"
  - description: Safe Url Link
  - type: `string`

## Example

```html
    <div [innerHtml]="htmlSnippet | safe: 'html'"></div>
```
