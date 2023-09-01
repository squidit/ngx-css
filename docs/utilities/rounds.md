# Rounds

CSS has classes that change the `border-radius` property to maintain standardization

<div class='grid-box mb-3 display-flex justify-content-space-between' style='height: auto'>
  <div class='background-gray p-2 text-center display-flex align-items-center justify-content-center rounded' style='width: 50px; height: 50px'>
    Item
  </div>
  <div class='background-gray p-2 text-center display-flex align-items-center justify-content-center border-radius' style='width: 50px; height: 50px'>
    Item
  </div>
  <div class='background-gray p-2 text-center display-flex align-items-center justify-content-center border-radius-medium' style='width: 50px; height: 50px'>
    Item
  </div>
  <div class='background-gray p-2 text-center display-flex align-items-center justify-content-center border-radius-none' style='width: 50px; height: 50px'>
    Item
  </div>
</div>

<h4>.rounded</h4>
Apply `border-radius: 50%`

```html
<div class='rounded'>...</div>
```

<h4>.border-radius</h4>
Apply `border-radius: 5px`

```html
<div class='border-radius'>...</div>
```

<h4>.border-radius-minor</h4>
Apply `border-radius: 2px`

```html
<div class='border-radius-minor'>...</div>
```

<h4>.border-radius-medium</h4>
Apply `border-radius: 8px`

```html
<div class='border-radius-medium'>...</div>
```

<h4>.border-radius-none</h4>
Apply `border-radius: none`

```html
<div class='border-radius-none'>...</div>
```