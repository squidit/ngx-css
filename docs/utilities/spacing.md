# Spacing

Spacing is based on Boostratp 5, see docs [here](https://getbootstrap.com/docs/5.0/)

Assign responsive-friendly margin or padding values to an element or a subset of its sides with shorthand classes. Includes support for individual properties, all properties, and vertical and horizontal properties. Classes are built from a default Sass map ranging from .25rem to 3rem.

### Notation
Spacing utilities that apply to all breakpoints, from xs to xxl, have no breakpoint abbreviation in them. This is because those classes are applied from min-width: 0 and up, and thus are not bound by a media query. The remaining breakpoints, however, do include a breakpoint abbreviation.

The classes are named using the format ```{property}{sides}-{size}``` for xs and ```{property}{sides}-{breakpoint}-{size}``` for sm, md, lg, xl, and xxl.

Where property is one of:

```
m - for classes that set margin
p - for classes that set padding
```

Where sides is one of:

```
t - for classes that set margin-top or padding-top
b - for classes that set margin-bottom or padding-bottom
x - for classes that set both *-left and *-right
y - for classes that set both *-top and *-bottom
blank - for classes that set a margin or padding on all 4 sides of the element
```

Where size is one of:
```
0 - for classes that eliminate the margin or padding by setting it to 0
1 - for classes that set the margin or padding to $spacer * .25
2 - for classes that set the margin or padding to $spacer * .5
3 - for classes that set the margin or padding to $spacer
4 -  for classes that set the margin or padding to $spacer * 1.5
5 - for classes that set the margin or padding to $spacer * 2
6 - for classes that set the margin or padding to $spacer * 2.5
7 - for classes that set the margin or padding to $spacer * 3
auto - for classes that set the margin to auto
```

## Examples
Here are some representative examples of these classes:
Default `$spacer: 1rem`

```scss
.mt-0 {
  margin-top: 0 !important;
}

.px-2 {
  padding-left: ($spacer * .5) !important;
  padding-right: ($spacer * .5) !important;
}

.p-3 {
  padding: $spacer !important;
}
```