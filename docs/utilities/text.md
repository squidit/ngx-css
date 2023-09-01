# Text

Documentation and examples for common text utilities.

## Text Alignment

Text-align are available like:

<p class='text-center background-white black border-radius p-2'>I`m a centered text</p>

```html
<p class='text-center'>I`m a centered text</p>
```

Some values for `text-align` are available with classes:

<table class='background-white black p-2 border-radius' style='max-width: 400px'>
    <thead>
        <tr>
            <th>
                Property
            </th>
            <th>
                Class
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                center
            </td>
            <td>
                text-center
            </td>
        </tr>
        <tr>
            <td>
                left
            </td>
            <td>
                text-left
            </td>
        </tr>
        <tr>
            <td>
                right
            </td>
            <td>
                text-right
            </td>
        </tr>
        <tr>
            <td>
                justify
            </td>
            <td>
                text-justify
            </td>
        </tr>
    </tbody>
</table>

## Text Weight

Text-weight are available like:

<p class='text-bold background-white black border-radius p-2'>I`m a bold text</p>

```html
<p class='text-bold'>I`m a bold text</p>
```

Some values for `text-weight` are available with classes:

<table class='background-white black p-2 border-radius' style='max-width: 400px'>
    <thead>
        <tr>
            <th>
                Weight
            </th>
            <th>
                Class
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                100
            </td>
            <td>
                text-thin
            </td>
        </tr>
        <tr>
            <td>
                300
            </td>
            <td>
                text-light
            </td>
        </tr>
        <tr>
            <td>
                400
            </td>
            <td>
                text-regular
            </td>
        </tr>
        <tr>
            <td>
                500
            </td>
            <td>
                text-medium
            </td>
        </tr>
        <tr>
            <td>
                700
            </td>
            <td>
                text-bold
            </td>
        </tr>
        <tr>
            <td>
                900
            </td>
            <td>
                text-black
            </td>
        </tr>
    </tbody>
</table>

## Text Elipsis

To add an ellipsis at the end of the text use the following classes:

<p class='text-ellipsis background-white black border-radius p-2' style='max-width: 90px;'>I`m a One line ellipsis</p>

```html
<p class='text-ellipsis' style='max-width: 90px;'>I`m a One line ellipsis</p>
```

If the text has more than one line use:

<p class='text-ellipsis-more background-white black border-radius p-2' style='max-width: 50px; max-height: 57px'>I`m a More than line ellipsis</p>

```html
<p class='text-ellipsis-more' style='max-width: 50px; max-height: 57px'>I`m a More than line ellipsis</p>
```

This classe use `-webkit-line-clamp: 3` to change the clip on more lines change this prop on your element