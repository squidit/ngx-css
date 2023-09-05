# NGX CSS - Library

## About

> NGX CSS Framework An angular abstraction for [Squid CSS](https://github.com/squidit/css)

## Table of contents

- [Example](#example)
- [Usage](#usage)
  - [Install](#install)
  - [Use Form Errors Variables](#use-form-errors-variables)
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
    "node_modules/@squidit/css/src/js/components/toast.js" // JS includes
  ]
  // ...
}
```

3. Add to your `style.scss` main file

```scss
$fontsFolderPath: '/assets/fonts'; // Overwrite default font path
@import '@squidit/css/src/scss/squid.scss'; // Import all Framework Styles
```

4. Import `NgxSquidModule` in your `app.module.ts`

```ts
import { NgxSquidModule } from '@squidit/ngx-css'

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
    "seachSelectEmpty": "There are no options to select",
    "fileSize": "File too large",
    "required": "Required field",
    "email": "Invalid email",
    "url": "Invalid URL. Attention: URL must start with https://",
    "date": "Invalid Date",
    "rangeDate:": "Date outside valid range"
  }
  // ...
}
```

## Development

1. Install npm dependences `npm install`

2. Run `npm start` to watch angular library (`src` directory)

3. In another window run `start:application`

This launches an angular pattern that is contained in the application folder. Just use the components inside it, and every change in the files in the `src` folder will be automatically reflected in the application.

### Write Documentation

We use [compodoc](https://github.com/compodoc/compodoc) to write docs with [jsDocs](https://jsdoc.app/)

Run `start:docs` and the compodoc will serve the docs. For each change it is necessary to run the command again

### Deploy yo NPM

> Just draft a new release here on Github and an actions will starts

**Important to use the same tag as package.json

## Documentation

See Docs [here](https://ngx-css.squidit.com.br)
