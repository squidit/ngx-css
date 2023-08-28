# Overlay-SQ

## Inputs/Props

### 1. open (optional)

- description: Open Overlay
- type: `boolean`

### 2. width

- description: Overlay width
- type: `string`
- default: `475px`

### 3. overleyClass (optional)

- description: Overlay custom class
- type: `string`

### 4. backdropClass (optional)

- description: Backdrop Overlay custom class
- type: `string`

### 5. overlayDirection

- description: Overlay open direction
- type: `'right' | 'left'`
- default: `right`

### 6. headerColor (optional)

- description: Header background-color
- type: `string`

### 7. footerColor (optional)

- description: Footer background-color
- type: `string`

### 8. bodyColor (optional)

- description: body background-color
- type: `string`

### 9. headerItemsColor (optional)

- description: Header close button color
- type: `string`

### 10. showClose

- description: Show button with a cross to close overlay
- type: `void`

## Outputs

### 1. overlayClose (optional)

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
  <button (click)='overlay = true'>Open Overlay</button>
  <sq-overlay
    (overlayClose)='overlay = false'
    [open]='overlay'
  >
    <ng-template #headerTemplate>
      Header
    </ng-template>
    Content
    <ng-template #footerTemplate>
      Footer
    </ng-template>
  </sq-overlay>
```
