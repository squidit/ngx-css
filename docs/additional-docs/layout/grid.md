# Grid

The grid systeam are based on the Bootstrap 5 grid, see docs [here](https://getbootstrap.com/docs/5.0/)

<style
  dangerouslySetInnerHTML={{__html: `
    div[class^="col"] {
      min-height: 50px;
      border: 1px solid var(--gray);
      background: var(--gray_light);
      color: var(--black);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    `
  }}
></style>

## Example

CSS grid system uses a series of containers, rows, and columns to layout and align content. It's built with [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and is fully responsive. Below is an example and an in-depth explanation for how the grid system comes together.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col">
        Column
      </div>
      <div class="col">
        Column
      </div>
      <div class="col">
        Column
      </div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
  </div>
</div>
```

The above example creates three equal-width columns across all devices and viewports using our predefined grid classes. Those columns are centered in the page with the parent `.container`.

## Grid options

CSS grid system can adapt across all six default breakpoints, and any breakpoints you customize. The six default grid tiers are as follow:

- Extra small (xs)
- Small (sm)
- Medium (md)
- Large (lg)
- Extra large (xl)
- Extra extra large (xxl)

As noted above, each of these breakpoints have their own container, unique class prefix, and modifiers. Here's how the grid changes across these breakpoints:

<table class="mb-4" style='max-width: 700px'>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">
        xs<br/>
        <span class="fw-normal">&lt;576px</span>
      </th>
      <th scope="col">
        sm<br/>
        <span class="fw-normal">&ge;576px</span>
      </th>
      <th scope="col">
        md<br/>
        <span class="fw-normal">&ge;768px</span>
      </th>
      <th scope="col">
        lg<br/>
        <span class="fw-normal">&ge;992px</span>
      </th>
      <th scope="col">
        xl<br/>
        <span class="fw-normal">&ge;1200px</span>
      </th>
      <th scope="col">
        xxl<br/>
        <span class="fw-normal">&ge;1400px</span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="text-bold" scope="row">Container max-width</td>
      <td>None (auto)</td>
      <td>540px</td>
      <td>720px</td>
      <td>960px</td>
      <td>1140px</td>
      <td>1320px</td>
    </tr>
    <tr>
      <td class="text-bold" scope="row">Class prefix</td>
      <td>.col-</td>
      <td>.col-sm-</td>
      <td>.col-md-</td>
      <td>.col-lg-</td>
      <td>.col-xl-</td>
      <td>.col-xxl-</td>
    </tr>
    <tr>
      <td class="text-bold" scope="row"># of columns</td>
      <td colspan="6">24</td>
    </tr>
    <tr>
      <td class="text-bold" scope="row">Gutter width</td>
      <td colspan="6">2rem (1rem on left and right)</td>
    </tr>
  </tbody>
</table>

## Auto-layout columns

Utilize breakpoint-specific column classes for easy column sizing without an explicit numbered class like `.col-sm-12`.

### Equal-width

For example, here are two grid layouts that apply to every device and viewport, from `xs` to `xxl`. Add any number of unit-less classes for each breakpoint you need and every column will be the same width.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col">
        1 of 2
      </div>
      <div class="col">
        2 of 2
      </div>
    </div>
    <div class="row">
      <div class="col">
        1 of 3
      </div>
      <div class="col">
        2 of 3
      </div>
      <div class="col">
        3 of 3
      </div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col">
      1 of 2
    </div>
    <div class="col">
      2 of 2
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      2 of 3
    </div>
    <div class="col">
      3 of 3
    </div>
  </div>
</div>
```

### Setting one column width

Auto-layout for flexbox grid columns also means you can set the width of one column and have the sibling columns automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline widths. Note that the other columns will resize no matter the width of the center column.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col">
        1 of 3
      </div>
      <div class="col-12">
        2 of 3 (wider)
      </div>
      <div class="col">
        3 of 3
      </div>
    </div>
    <div class="row">
      <div class="col">
        1 of 3
      </div>
      <div class="col-10">
        2 of 3 (wider)
      </div>
      <div class="col">
        3 of 3
      </div>
    </div>
  </div>
</div>

```html
<div class="container">
    <div class="row">
      <div class="col">
        1 of 3
      </div>
      <div class="col-12">
        2 of 3 (wider)
      </div>
      <div class="col">
        3 of 3
      </div>
    </div>
    <div class="row">
      <div class="col">
        1 of 3
      </div>
      <div class="col-10">
        2 of 3 (wider)
      </div>
      <div class="col">
        3 of 3
      </div>
    </div>
  </div>
```

### Variable width content

Use `col-{breakpoint}-auto` classes to size columns based on the natural width of their content.

<div class='grid-box'>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col col-lg-4">
        1 of 3
      </div>
      <div class="col-md-auto">
        Variable width content
      </div>
      <div class="col col-lg-4">
        3 of 3
      </div>
    </div>
    <div class="row">
      <div class="col">
        1 of 3
      </div>
      <div class="col-md-auto">
        Variable width content
      </div>
      <div class="col col-lg-4">
        3 of 3
      </div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row justify-content-md-center">
    <div class="col col-lg-4">
      1 of 3
    </div>
    <div class="col-md-auto">
      Variable width content
    </div>
    <div class="col col-lg-4">
      3 of 3
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col-md-auto">
      Variable width content
    </div>
    <div class="col col-lg-4">
      3 of 3
    </div>
  </div>
</div>
```

## Responsive classes

CSS grid includes six tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints

For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to `.col`.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col">col</div>
      <div class="col">col</div>
      <div class="col">col</div>
      <div class="col">col</div>
    </div>
    <div class="row">
      <div class="col-16">col-16</div>
      <div class="col-8">col-8</div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col">col</div>
    <div class="col">col</div>
    <div class="col">col</div>
    <div class="col">col</div>
  </div>
  <div class="row">
    <div class="col-16">col-16</div>
    <div class="col-8">col-8</div>
  </div>
</div>
```

### Stacked to horizontal

Using a single set of `.col-sm-*` classes, you can create a basic grid system that starts out stacked and becomes horizontal at the small breakpoint (`sm`).

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col-sm-16">col-sm-16</div>
      <div class="col-sm-8">col-sm-8</div>
    </div>
    <div class="row">
      <div class="col-sm">col-sm</div>
      <div class="col-sm">col-sm</div>
      <div class="col-sm">col-sm</div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col-sm-16">col-sm-16</div>
    <div class="col-sm-8">col-sm-8</div>
  </div>
  <div class="row">
    <div class="col-sm">col-sm</div>
    <div class="col-sm">col-sm</div>
    <div class="col-sm">col-sm</div>
  </div>
</div>
```

### Mix and match

Don't want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col-md-16">.col-md-16</div>
      <div class="col-12 col-md-8">.col-12 .col-md-8</div>
    </div>
    <div class="row">
      <div class="col-12 col-md-8">.col-12 .col-md-8</div>
      <div class="col-12 col-md-8">.col-12 .col-md-8</div>
      <div class="col-12 col-md-8">.col-12 .col-md-8</div>
    </div>
    <div class="row">
      <div class="col-12">.col-12</div>
      <div class="col-12">.col-12</div>
    </div>
  </div>
</div>

```html
<div class="container">
  <!-- Stack the columns on mobile by making one full-width and the other half-width -->
  <div class="row">
    <div class="col-md-16">.col-md-16</div>
    <div class="col-12 col-md-8">.col-12 .col-md-8</div>
  </div>

  <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
  <div class="row">
    <div class="col-12 col-md-8">.col-12 .col-md-8</div>
    <div class="col-12 col-md-8">.col-12 .col-md-8</div>
    <div class="col-12 col-md-8">.col-12 .col-md-8</div>
  </div>

  <!-- Columns are always 50% wide, on mobile and desktop -->
  <div class="row">
    <div class="col-12">.col-12</div>
    <div class="col-12">.col-12</div>
  </div>
</div>
```


## Nesting

To nest your content with the default grid, add a new `.row` and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        Level 1: .col-sm-6
      </div>
      <div class="col-sm-18" style='display: initial;'>
        <div class="row py-3">
          <div class="col-16 col-sm-12">
            Level 2: .col-16 .col-sm-12
          </div>
          <div class="col-8 col-sm-12">
            Level 2: .col-8 .col-sm-12
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col-sm-6">
      Level 1: .col-sm-6
    </div>
    <div class="col-sm-18">
      <div class="row">
        <div class="col-16 col-sm-12">
          Level 2: .col-16 .col-sm-12
        </div>
        <div class="col-8 col-sm-12">
          Level 2: .col-8 .col-sm-12
        </div>
      </div>
    </div>
  </div>
</div>
```

## Offsetting

You can offset grid columns in two ways: our responsive `.offset-` grid classes. Grid classes are sized to match columns while margins are more useful for quick layouts where the width of the offset is variable.

#### Offset classes

Move columns to the right using `.offset-md-*` classes. These classes increase the left margin of a column by `*` columns. For example, `.offset-md-4` moves `.col-md-4` over four columns.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col-md-8">.col-md-8</div>
      <div class="col-md-8 offset-md-8">.col-md-8 .offset-md-8</div>
    </div>
    <div class="row">
      <div class="col-md-6 offset-md-6">.col-md-6 .offset-md-6</div>
      <div class="col-md-6 offset-md-6">.col-md-6 .offset-md-6</div>
    </div>
    <div class="row">
      <div class="col-md-12 offset-md-6">.col-md-12 .offset-md-6</div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col-md-8">.col-md-8</div>
    <div class="col-md-8 offset-md-8">.col-md-8 .offset-md-8</div>
  </div>
  <div class="row">
    <div class="col-md-6 offset-md-6">.col-md-6 .offset-md-6</div>
    <div class="col-md-6 offset-md-6">.col-md-6 .offset-md-6</div>
  </div>
  <div class="row">
    <div class="col-md-12 offset-md-6">.col-md-12 .offset-md-6</div>
  </div>
</div>
```

In addition to column clearing at responsive breakpoints, you may need to reset offsets.

<div class='grid-box'>
  <div class="container">
    <div class="row">
      <div class="col-sm-10 col-md-12">.col-sm-10 .col-md-12</div>
      <div class="col-sm-10 offset-sm-4 col-md-12 offset-md-0">.col-sm-10 .offset-sm-4 .col-md-12 .offset-md-0</div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-10 col-lg-12">.col-sm-12 .col-md-10 .col-lg-12</div>
      <div class="col-sm-12 col-md-10 offset-md-4 col-lg-12 offset-lg-0">.col-sm-12 .col-md-10 .offset-md-4 .col-lg-12 .offset-lg-0</div>
    </div>
  </div>
</div>

```html
<div class="container">
  <div class="row">
    <div class="col-sm-10 col-md-12">.col-sm-10 .col-md-12</div>
    <div class="col-sm-10 offset-sm-4 col-md-12 offset-md-0">.col-sm-10 .offset-sm-4 .col-md-12 .offset-md-0</div>
  </div>
  <div class="row">
    <div class="col-sm-12 col-md-10 col-lg-12">.col-sm-12 .col-md-10 .col-lg-12</div>
    <div class="col-sm-12 col-md-10 offset-md-4 col-lg-12 offset-lg-0">.col-sm-12 .col-md-10 .offset-md-4 .col-lg-12 .offset-lg-0</div>
  </div>
</div>
```