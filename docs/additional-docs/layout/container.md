# Container

The Container are based on the Bootstrap 5 grid, see docs [here](https://getbootstrap.com/docs/5.0/)

## How they work

Containers are the most basic layout element and are **required when using our default grid system**. Containers are used to contain, pad, and (sometimes) center the content within them. While containers *can* be nested, most layouts do not require a nested container.

CSS comes with two different containers:

- `.container`, which sets a `max-width` at each responsive breakpoint
- `.container-fluid`, which is `width: 100%` at all breakpoints

The table below illustrates how each container's `max-width` across each breakpoint.

<table style='max-width: 700px'>
  <thead>
    <tr>
      <th class="border-dark"></th>
      <th scope="col">
        Extra small<br/>
        <span class="text-bold">&lt;576px</span>
      </th>
      <th scope="col">
        Small<br/>
        <span class="text-bold">&ge;576px</span>
      </th>
      <th scope="col">
        Medium<br/>
        <span class="text-bold">&ge;768px</span>
      </th>
      <th scope="col">
        Large<br/>
        <span class="text-bold">&ge;992px</span>
      </th>
      <th scope="col">
        X-Large<br/>
        <span class="text-bold">&ge;1200px</span>
      </th>
      <th scope="col">
        XX-Large<br/>
        <span class="text-bold">&ge;1400px</span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row" class="text-bold">.container</td>
      <td class="gray">100%</td>
      <td>540px</td>
      <td>720px</td>
      <td>960px</td>
      <td>1140px</td>
      <td>1320px</td>
    </tr>
    <tr>
      <td scope="row" class="text-bold">.container-fluid</td>
      <td class="gray">100%</td>
      <td class="gray">100%</td>
      <td class="gray">100%</td>
      <td class="gray">100%</td>
      <td class="gray">100%</td>
      <td class="gray">100%</td>
    </tr>
  </tbody>
</table>

## Default container

Our default `.container` class is a responsive, fixed-width container, meaning its `max-width` changes at each breakpoint.

```html
<div class="container">
  <!-- Content here -->
</div>
```

## Fluid containers

Use `.container-fluid` for a full width container, spanning the entire width of the viewport.

```html
<div class="container-fluid">
  ...
</div>
```
