# Colors

We use a relatively extensive set of cores within CSS. <br/>
All colors in addition to being SASS variables (like `$pink`) are also CSS variables to use globally like `var(--pink)`.
<p>To see all the colors and their variations go to the <a className='pink' href='https://css.squidit.com.br/styleguide'>Styleguide page</a></p>
<p className='mb-3'>All colors have three types of auxiliary classes.</p>

## Color Attribute

To change the `color` rule just use the color name as class.

<p class='pink'>
  I`m a pink paragraph
</p>
<p class='pink-light'>
  I`m a pink light paragraph
</p>
<p class='blue'>
  I`m a blue paragraph
</p>

```html
<p class='pink'>
  I`m a pink paragraph
</p>
<p class='pink-light'>
  I`m a pink light paragraph
</p>
<p class='blue'>
  I`m a blue paragraph
</p>
```

## Background Color Attribute

To change the `background-color` rule just use the color name as class with the prefix `background-`.

<p class='background-pink p-2'>
  I`m a paragraph with background pink
</p>
<p class='background-pink-light black p-2'>
  I`m a paragraph with background pink light
</p>
<p class='background-blue p-2'>
  I`m a paragraph with background blue
</p>

```html
<p class='background-pink'>
  I`m a paragraph with background pink
</p>
<p class='background-pink-light'>
  I`m a paragraph with background pink light
</p>
<p class='background-blue'>
  I`m a paragraph with background blue
</p>
```

## Border Color Attribute

To change the `border-color` rule just use the color name as class with the prefix `border-`. 
The element needs to have the `border` property set, the example below is using `border: 1px solid transparent`.
The `transparent` will be overwritten by the color class.

<p class='border-pink p-2' style='border: 1px solid transparent'>
  I`m a paragraph with border pink
</p>
<p class='border-pink-light p-2' style='border: 1px solid transparent'>
  I`m a paragraph with border pink light
</p>
<p class='border-blue p-2' style='border: 1px solid transparent'>
  I`m a paragraph with border blue
</p>

```html
<p class='border-pink' style='border: 1px solid transparent'>
  I`m a paragraph with border pink
</p>
<p class='border-pink-light' style='border: 1px solid transparent'>
  I`m a paragraph with border pink light
</p>
<p class='border-blue' style='border: 1px solid transparent'>
  I`m a paragraph with border blue
</p>
```