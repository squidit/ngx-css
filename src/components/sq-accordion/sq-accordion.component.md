# Accordion

> Component responsible for orchestrating a group of Collapses

## Inputs/Props

### 1. onlyOne (optional)

- description: Allows to open only one Collapse at a time
- type: `boolean`

### 2. openFirst (optional)

- description: Open the first Collapse
- type: `boolean`

## Outputs

## Example

```html
<sq-accordion
  [onlyOne]='true'
  [openFirst]='true'
>
  <sq-collapse
    [header]='true'
    [loading]='false'
    [disabled]='false'
  >
    <ng-template #header>
      Header Collapse HTML
    </ng-template>
    Content Collapse Html
  </sq-collapse>
  <sq-collapse
    [header]='true'
  >
    <ng-template #header>
      <p>Another Template</p>
    </ng-template>
    <div class='test-collapse'>
      Another Content
    </div>
  </sq-collapse>
</sq-accordion>
```
