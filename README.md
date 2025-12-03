# NGX CSS - Library

## About

> NGX CSS Framework An angular abstraction for [Squid CSS](https://github.com/squidit/css)

## Table of contents

- [Example](#example)
- [Usage](#usage)
  - [Install](#install)
  - [Use Form Errors Variables](#use-form-errors-variables)
  - [SqModalService](#sqmodalservice)
  - [SqToastService](#sqtoastservice)
- [Development](#development)
  - [Write Documentation](#write-documentation)
  - [Deploy to NPM](#deploy-to-npm)
- [Documentation](#documentation)

## Exemple

See an exemple of all components [here](https://css.squidit.com.br/styleguide)

## Usage

### Install

1. Install

```bash
npm install @squidit/css @squidit/ngx-css --save
```

2. Add `css` and `toast js` files to your `angular.json`

```json
{
  // ...,
  "assets": [
    // This object inside assets Array
    {
      "glob": "**/*",
      "input": "./node_modules/@squidit/css/dist/fonts",
      "output": "./assets/fonts" // Output fonts
    },
    "src/assets" // Default assets
  ],
  "styles": [
    "src/styles.scss"
  ],
  "scripts": [
    "node_modules/@squidit/css/src/js/components/toast.js" // JS includes (legacy)
  ]
  // ...
}
```

3. Add to your `style.scss` main file

```scss
$fontsFolderPath: '/assets/fonts'; // Overwrite default font path
@import '@squidit/css/src/scss/squid.scss'; // Import all Framework Styles
```

4. Import `SquidCSSModule` in your `*.module.ts`

```ts
import { SquidCSSModule } from '@squidit/ngx-css'

@NgModule({
  // ...
  imports: [
    // ...
    NgxSquidModule
  ]
  // ...
})
```

#### Use form erros variables

To use the errors handled in form components, you need to follow the steps below

1. Install [ngx-translate](https://github.com/ngx-translate/core) and follow the initial Setup

2. On you `.json` files from each language follow the same structure (need one for each supported language of your application):

```json
{
  // ...
  "forms": {
    "search": "Search",
    "searchSelectEmpty": "There are no options to select",
    "fileSize": "File too large",
    "required": "Required field",
    "minimumRequired": "The minimum number of selected tags must be greater than or equal to {{ minTags }}",
    "email": "Invalid email",
    "url": "Invalid URL. Attention: URL must start with https://",
    "date": "Invalid Date",
    "phone": "Invalid phone number",
    "minValueAllowed": "Min value allowed is: {{ min }}",
    "maxValueAllowed": "Max value allowed is: {{ max }}",
    "rangeDate:": "Date outside valid range"
  }
  // ...
}
```

---

### SqModalService

Service for programmatically opening Modal and Overlay dialogs. Fully testable, Observable-based, with proper memory management.

#### Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { SqModalService } from '@squidit/ngx-css';

@Component({...})
export class MyComponent {
  private modalService = inject(SqModalService);

  openSimpleModal() {
    this.modalService.openModal({
      header: 'Confirm Action',
      body: myBodyTemplate, // TemplateRef or Component
      size: 'md'
    }).subscribe(result => {
      if (result) {
        console.log('User confirmed!');
      }
    });
  }
}
```

#### Modal Configuration

```typescript
interface SqModalConfig<T = any> {
  id?: string;                    // Unique ID (auto-generated if not provided)
  header?: string | TemplateRef;  // Header content (string = title)
  body?: TemplateRef | Type<any>; // Body content (template or component)
  footer?: TemplateRef;           // Footer content (template)
  data?: T;                       // Data to pass to content
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Modal size (default: 'md')
  backdrop?: 'static' | true;     // Backdrop behavior (default: 'static')
  showCloseButton?: boolean;      // Show X button (default: true)
  customClass?: string;           // Additional CSS classes
  cancelText?: string;            // Cancel button text (default: 'Cancelar')
  confirmText?: string;           // Confirm button text (default: 'Confirmar')
  dataTest?: string;              // data-test attribute for testing
}
```

#### Overlay Configuration

```typescript
interface SqOverlayConfig<T = any> extends SqDialogConfig<T> {
  direction?: 'left' | 'right' | 'top' | 'bottom'; // Slide direction (default: 'right')
  width?: string;    // Custom width for left/right overlays
  height?: string;   // Custom height for top/bottom overlays
  borderless?: boolean;
}
```

#### Opening with Templates

```typescript
@ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
@ViewChild('bodyTemplate') bodyTemplate!: TemplateRef<any>;
@ViewChild('footerTemplate') footerTemplate!: TemplateRef<any>;

openModal() {
  this.modalService.openModal({
    header: this.headerTemplate,
    body: this.bodyTemplate,
    footer: this.footerTemplate,
    data: { items: this.items }
  });
}
```

```html
<ng-template #bodyTemplate let-modal let-data="data">
  <ul>
    @for (item of data.items; track item.id) {
      <li>{{ item.name }}</li>
    }
  </ul>
</ng-template>

<ng-template #footerTemplate let-modal let-data="data">
  <button (click)="modal.close()">Cancel</button>
  <button (click)="modal.close(data)">Save</button>
</ng-template>
```

#### Opening with Components

```typescript
// Content component
@Component({
  selector: 'app-my-content',
  template: `
    <h3>{{ title }}</h3>
    <button (click)="dialogRef?.close({ saved: true })">Save</button>
  `
})
export class MyContentComponent {
  @Input() title!: string;       // Receives from data
  @Input() dialogRef?: SqDialogRef; // Auto-injected
  
  // Optional: provide header/footer templates
  @ViewChild('headerTemplate') headerTemplate?: TemplateRef<any>;
  @ViewChild('footerTemplate') footerTemplate?: TemplateRef<any>;
}

// Opening
this.modalService.openModal({
  body: MyContentComponent,
  data: { title: 'My Modal Title' }
}).subscribe(result => {
  if (result?.saved) {
    console.log('Data was saved!');
  }
});
```

#### Opening an Overlay

```typescript
openSidePanel() {
  this.modalService.openOverlay({
    direction: 'right',
    width: '500px',
    body: FilterPanelComponent,
    data: { filters: this.currentFilters }
  }).subscribe(result => {
    if (result) {
      this.applyFilters(result);
    }
  });
}
```

#### Confirmation Before Close

Use the `confirmBeforeClose` operator to prompt user before closing without saving:

```typescript
import { confirmBeforeClose } from '@squidit/ngx-css';

this.modalService.openModal({
  body: MyFormComponent,
  data: { form: this.form }
}).pipe(
  confirmBeforeClose(() => {
    // Return Observable<boolean>, Promise<boolean>, or boolean
    return confirm('You have unsaved changes. Discard?');
  })
).subscribe(result => {
  // Only reaches here if user confirms or saves
});
```

#### Programmatic Control

```typescript
const ref = this.modalService.openModal({...});

// Close with result
ref.close({ success: true });

// Close without result (cancel)
ref.close();

// Update data in content component
ref.updateData({ loading: true });

// Close all modals
this.modalService.closeAll();

// Check open count
console.log(this.modalService.openCount);
```

---

### SqToastService

Service for displaying toast notifications. Observable-based, fully testable, with proper memory management and data-test attributes.

#### Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { SqToastService } from '@squidit/ngx-css';

@Component({...})
export class MyComponent {
  private toastService = inject(SqToastService);

  showSuccess() {
    this.toastService.success('Operation completed successfully!');
  }

  showError() {
    this.toastService.error('Something went wrong.');
  }
}
```

#### Toast Types

```typescript
// Success (green)
this.toastService.success('Item saved!');

// Error (red)
this.toastService.error('Failed to save item.');

// Warning (yellow)
this.toastService.warning('This action cannot be undone.');

// Info (blue)
this.toastService.info('New updates available.');

// Default (gray)
this.toastService.default('Notification message.');
```

#### Toast Configuration

```typescript
interface SqToastConfig {
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  duration?: number;       // ms, 0 = persistent (default: 5000)
  position?: SqToastPosition; // (default: 'top-right')
  closeable?: boolean;     // Show close button (default: true)
  showIcon?: boolean;      // Show type icon (default: false)
  icon?: string;           // Custom icon class (FontAwesome)
  dismissOnClick?: boolean; // Click toast to dismiss (default: false)
  pauseOnHover?: boolean;  // Pause timer on hover (default: true)
  action?: {               // Action button
    label: string;
    callback?: () => void;
  };
  customClass?: string;
  dataTest?: string;       // data-test attribute
  data?: any;              // Data for template messages
}
```

#### Available Positions

```typescript
type SqToastPosition =
  | 'top-right'      // Default
  | 'top-left'
  | 'top-center'
  | 'top-full'       // Full-width banner at top
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-full';   // Full-width banner at bottom
```

#### With Action Button

```typescript
this.toastService.success('Item deleted', {
  duration: 8000,
  action: {
    label: 'Undo',
    callback: () => this.undoDelete()
  }
});
```

#### Persistent Toast (Manual Dismiss)

```typescript
const ref = this.toastService.warning('Processing...', {
  duration: 0 // Never auto-dismiss
});

// Later, dismiss programmatically
ref.dismiss();
```

#### With Observable Lifecycle

```typescript
this.toastService.info('Click me!', {
  duration: 0,
  dismissOnClick: true
}).afterDismissed().subscribe(reason => {
  // reason: 'timeout' | 'action' | 'manual' | 'swipe'
  console.log('Toast dismissed by:', reason);
});
```

#### Full-Width Banner

```typescript
// Top banner (like success notification)
this.toastService.success('Campaign created successfully!', {
  position: 'top-full'
});

// Bottom banner
this.toastService.error('Connection lost', {
  position: 'bottom-full'
});
```

#### With Custom Template

```typescript
@ViewChild('customToast') customToast!: TemplateRef<any>;

showCustom() {
  this.toastService.success(this.customToast, {
    data: { userName: 'John', count: 5 }
  });
}
```

```html
<ng-template #customToast let-ref let-data="data">
  <strong>{{ data.userName }}</strong> completed {{ data.count }} tasks!
  <button (click)="ref.dismiss()">OK</button>
</ng-template>
```

#### Global Operations

```typescript
// Dismiss all active toasts
this.toastService.dismissAll();

// Get count of active toasts
console.log(this.toastService.getActiveCount());
```

#### Unit Testing

```typescript
it('should show success toast', () => {
  const toastSpy = spyOn(toastService, 'success').and.callThrough();
  
  component.save();
  
  expect(toastSpy).toHaveBeenCalledWith('Data saved!');
});
```

#### E2E Testing (Cypress)

```typescript
// Find toast by data-test
cy.get('[data-test="sq-toast-container"]').should('exist');
cy.get('[data-test="sq-toast-1"]').should('contain', 'Success!');
cy.get('[data-test="sq-toast-1-close"]').click();
```

---

## Development

1. Install npm dependences `npm install`

2. Run `npm start` to watch angular library (`src` directory)

3. In another window run `start:application`

This launches an angular pattern that is contained in the application folder. Just use the components inside it, and every change in the files in the `src` folder will be automatically reflected in the application.

### Write Documentation

We use [compodoc](https://github.com/compodoc/compodoc) to write docs with [jsDocs](https://jsdoc.app/)

Run `start:docs` and the compodoc will serve the docs. For each change it is necessary to run the command again

### Deploy to NPM

> Just draft a new release here on Github and an actions will starts

**Important to use the same tag as package.json

## Documentation

See Docs [here](https://ngx-css.squidit.com.br)
