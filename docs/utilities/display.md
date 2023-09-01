# Display

CSS has `display` rule classes

As such, the classes are named using the format:

- `display-{value} for xs`
- `display-{breakpoint}-{value} for sm, md, lg, xl, and xxl.`

Where value is one of:

```
none
inline
inline-block
block
grid
table
table-cell
table-row
flex
inline-flex
```

## Examples

<p className="display-flex">I`m a flex paragraph</p>

```html
<p className="display-flex">
  ...
</p>
```

<p className="display-sm-flex">
  I`m a grid paragraph only when it is smaller than sm breakpoint
</p>

```html
<p className="display-sm-flex">
  ...
</p>
```

### Visibility Hidden Force

Apply a `visibility: hidden !important;` rule to an element to visually hide it but keep it accessible to screen readers.

```html
<p className="visibility-hidden-force">
  ...
</p>
```
