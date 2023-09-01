# Flex

If your element is a `flex` type element, with its own rules or using the `display-flex` class, the CSS has the `align-items` and `justify-content` attribute classes for alignment to Parent Node or `align-self` and `justify-self` to Child Node

## Align items

<div class='grid-box display-flex align-items-center mb-3' style='height: 100px'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex align-items-flex-start mb-3' style='height: 100px'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex align-items-flex-end mb-3' style='height: 100px'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex align-items-baseline mb-3' style='height: 100px'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex align-items-stretch mb-3' style='height: 100px'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

```html

<div class="display-flex align-items-center">...</div>
<div class="display-flex align-items-flex-start">...</div>
<div class="display-flex align-items-flex-end">...</div>
<div class="display-flex align-items-baseline">...</div>
<div class="display-flex align-items-stretch">...</div>
```

Where value is one of:

```
center
start
end
baseline
flex-start
flex-end
unset
```

And all supports the suffix breakpoint like `sm`, `md`, `lg`, `xl`, `xxl`

 - `align-items-{value} for xs`
 - `align-items-{breakpoint}-{value} for sm, md, lg, xl, and xxl.`

## Align Self

<div class='grid-box display-flex align-items-center mb-3' style='height: 100px'>
  <div class='background-gray-light black p-2 align-self-start mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1 align-self-flex-end'>Item</div>
  <div class='background-gray-light black p-2 mx-1 align-self-stretch'>Item</div>
</div>

```html
<div class="display-flex align-items-center">
  <div class='align-self-flex-start'>Item</div>
  <div>Item</div>
  <div class='align-self-flex-end'>Item</div>
  <div class='align-self-stretch'>Item</div>
</div>
```

Where value is one of:

```
center
start
end
baseline
flex-start
flex-end
unset
```

And all supports the suffix breakpoint like `sm`, `md`, `lg`, `xl`, `xxl`

 - `align-self-{value} for xs`
 - `align-self-{breakpoint}-{value} for sm, md, lg, xl, and xxl.`

## Justify Content

<div class='grid-box display-flex justify-content-center mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex align-items-flex-start mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex justify-content-flex-end mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex justify-content-space-between mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex justify-content-space-evenly mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

<div class='grid-box display-flex justify-content-space-around mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
</div>

```html
<div class="display-flex justify-content-center">...</div>
<div class="display-flex justify-content-flex-start">...</div>
<div class="display-flex justify-content-flex-end">...</div>
<div class="display-flex justify-content-space-between">...</div>
<div class="display-flex justify-content-space-evenly">...</div>
<div class="display-flex justify-content-space-around">...</div>
```

Where value is one of:

```
center
start
end
flex-start
flex-end
space-between
space-evenly
space-around
left
right
unset
```

And all supports the suffix breakpoint like `sm`, `md`, `lg`, `xl`, `xxl`

 - `justify-content-{value} for xs`
 - `justify-content-{breakpoint}-{value} for sm, md, lg, xl, and xxl.`

## Justify Self

<div class='grid-box display-flex justify-content-space-around mb-3' style='height: auto'>
  <div class='background-gray-light black p-2 mx-1 justify-self-flex-start'>Item</div>
  <div class='background-gray-light black p-2 mx-1'>Item</div>
  <div class='background-gray-light black p-2 mx-1 justify-self-flex-end'>Item</div>
</div>

```html
<div class="display-flex justify-content-center">
  <div class='justify-self-flex-start'>Item</div>
  <div>Item</div>
  <div class='justify-self-flex-en'>Item</div>
</div>
```

Where value is one of:

```
center
start
end
flex-start
flex-end
space-between
space-evenly
space-around
left
right
unset
```

And all supports the suffix breakpoint like `sm`, `md`, `lg`, `xl`, `xxl`

 - `justify-self-{value} for xs`
 - `justify-slef-{breakpoint}-{value} for sm, md, lg, xl, and xxl.`
