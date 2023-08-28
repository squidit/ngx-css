# Modal-SQ

> Component that Bootstrap Modal

## Inputs/Props

### 1. open (optional)

- description: Open modal
- type: `boolean`

### 2. modalSize (optional)

- description: Modal Size
- type: `sm | md | lg | xl`

### 3. modalClass (optional)

- description: Modal custom class
- type: `string`

### 4. backdropClass (optional)

- description: Backdrop modal custom class
- type: `string`

### 5. needPriority

- description: If true, modal will be on top of other modals
- type: `boolean`

## Outputs

### 1. modalClose (optional)

- description: Return when modal is closed os dimissed.
- type: `void`

### 2. leftPress (optional)

- description: Returns when left arrow is pressed
- type: `void`

### 3. rightPress (optional)

- description: Returns when right arrow is pressed
- type: `void`

## Example

```html
  <button (click)='modal = true'>Open Modal</button>
  <sq-modal
    (modalClose)='modal = false'
    [open]='modal'
  >
    <!-- Modal Header -->
    <ng-template #headerModal>
      Header
    </ng-template>
    <!-- Modal Header -->
    <!-- Modal Body -->
    Content
    <!-- Modal Body -->
    <!-- Modal Footer -->
    <ng-template #footerModal>
      Footer
    </ng-template>
    <!-- Modal Footer -->
  </sq-modal>
```
