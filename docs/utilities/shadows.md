# Shadows

CSS has classes that change the shadows variants property to maintain standardization

## Box Shadow
Apply `box-shadow: 0px 4px 12px -5px var(--gray)`

<div class='box box-shadow'>
  Box Content
</div>

```html
<div class='box-shadow'>...</div>
```

## Text Shadow
Apply `text-shadow:: 0px 4px 12px var(--gray)`

<div class='box text-shadow box-shadow-none'>
  Box Content
</div>

```html
<div class='text-shadow'>...</div>
```

## Drop Shadow
Apply `filter: drop-shadow(0px 4px 12px var(--gray))`

<div style='max-width: 300px'>
  <img
    src='https://portal.squidit.com.br/assets/img/jpg/default-image.jpg'
    alt='Default Image'
    title='Default Image'
    class='img-fluid drop-shadow'
  />
</div>

```html
<img class='drop-shadow' src='...'>
```

## Reset
To reset any shadow applied use the following classes:

```html
<div class='box-shadow-none'>...</div>
<div class='text-shadow-none'>...</div>
<div class='drop-shadow-none'>...</div>
```