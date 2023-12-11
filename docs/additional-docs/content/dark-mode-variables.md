
# Dark Mode Variables

We bring already configured a theme of dark mode.
The exchange of variables is done in two situations:

1. By user's browser preference
2. With a class in the body

## 1. By user's browser preference

The user doesn't need to do anything, the change will be done automatically according to the `prefers-color-scheme` css rule

## 2. With a class in the body

If there is a need to lock this automatic switch or make a theme selector for the user, just add a class in the body for their respective themes:

> To dark mode

```html
<html class="dark">
  ...
</html
```

> To light mode

```html
<html class="light">
  ...
</html
```

## Variables

List of variables that change with the change of theme if there is a need to use it in a custom component, these are the variables changed in the change of the theme that reflect in all the components of the framework

```css
  --background
  --background_secondary
  --text_color
  --title_color
  --background_third
  --background_reset
  --shadow_color
  --box_shadow
  --border_color
```
