# Table

To usa table just add `.table` on `<table>` tag.
The `<th>` tag has a default border. Use colors border classes to change or overwrite with css on `<th>` tag

## Exemple

<table class="table">
  <thead>
    <tr>
      <th scope="col" class='border-pink'>#</th>
      <th scope="col" class='border-pink'>Column 1</th>
      <th scope="col" class='border-pink last-col'>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1
      </td>
      <td>
        Column 2
      </td>
      <td>
        Column 3
      </td>
    </tr>
    <tr>
      <td>
        2
      </td>
      <td>
        Column 2
      </td>
      <td>
        Column 3
      </td>
    </tr>
    <tr>
      <td>
        3
      </td>
      <td>
        Column 2
      </td>
      <td>
        Column 3
      </td>
    </tr>
  </tbody>
</table>

```html
<table class="table table-responsive">
  <thead>
    <tr>
      <th scope="col" class='border-pink'>#</th>
      <th scope="col" class='border-pink'>Column 1</th>
      <th scope="col" class='border-pink last-col'>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1
      </td>
      <td>
        Column 2
      </td>
      <td>
        Column 3
      </td>
    </tr>
    <tr>
      <td>
        2
      </td>
      <td>
        Column 2
      </td>
      <td>
        Column 3
      </td>
    </tr>
    <tr>
      <td>
        3
      </td>
      <td>
        Column 2
      </td>
      <td>
        Column 3
      </td>
    </tr>
  </tbody>
</table>
```

### Responsive Overflow

With the `.table-overflow` class on parent container if the width of the parent element is smaller than the table's contents, it will generate a horizontal overflow

<div class='table-overflow'>
  <table class="table">
    <thead>
      <tr>
        <th scope="col" class='border-pink'>#</th>
        <th scope="col" class='border-pink'>Column 1</th>
        <th scope="col" class='border-pink last-col'>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          1
        </td>
        <td>
          <p style='min-width: 700px'>
            Column 2
          </p>
        </td>
        <td>
          Column 3
        </td>
      </tr>
      <tr>
        <td>
          2
        </td>
        <td>
          <p style='min-width: 700px'>
            Column 2
          </p>
        </td>
        <td>
          Column 3
        </td>
      </tr>
      <tr>
        <td>
          3
        </td>
        <td>
          <p style='min-width: 700px'>
            Column 2
          </p>
        </td>
        <td>
          Column 3
        </td>
      </tr>
    </tbody>
  </table>
</div>

```html
<div class='table-overflow'>
  <table class="table table-overflow">
    ...
  </table>
</div>
```

### Mobile Table

The table using the `.table-responsive` class on `lg` breaktpoint (< 992px) makes each row of the table have its respective column inverted per row since the `<td>` has the attribute `data-label` filled

<table class="table table-responsive">
  <thead>
    <tr>
      <th scope="col" class='border-pink'>#</th>
      <th scope="col" class='border-pink'>Column 1</th>
      <th scope="col" class='border-pink last-col'>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label='Column 1'>
        1
      </td>
      <td data-label='Column 2'>
        <p
          class='text-ellipsis'          
        >
          Column 2
        </p>
      </td>
      <td data-label='Column 3'>
        <p
          class='text-ellipsis'
        >
          Column 3
        </p>
      </td>
    </tr>
    <tr>
      <td data-label='Column 1'>
        2
      </td>
      <td data-label='Column 2'>
        <p
          class='text-ellipsis'
        >
          Column 2
        </p>
      </td>
      <td data-label='Column 3'>
        <p
          class='text-ellipsis'
        >
          Column 3
        </p>
      </td>
    </tr>
    <tr>
      <td data-label='Column 1'>
        3
      </td>
      <td data-label='Column 2'>
        <p
          class='text-ellipsis'
        >
          Column 2
        </p>
      </td>
      <td data-label='Column 3'>
        <p
          class='text-ellipsis'
        >
          Column 3
        </p>
      </td>
    </tr>
  </tbody>
</table>

```html
<table class="table table-responsive">
  ...
  <tr>
    <td data-label='Column 1'>
      1
    </td>
    <td data-label='Column 2'>
      <p
        class='text-ellipsis'
      >
        Column 2
      </p>
    </td>
    <td data-label='Column 3'>
      <p
        class='text-ellipsis'
      >
        Column 3
      </p>
    </td>
  </tr>
</table>
```

### Buttons Hover

To use the hover in the table row to show the buttons create a column with the `.wrapper-buttons` class.

<table class="table table-responsive">
  <thead>
    <tr>
      <th scope="col" class='border-pink'>#</th>
      <th scope="col" class='border-pink'>Column 1</th>
      <th scope="col" class='border-pink last-col'>Column 2</th>
      <th scope="col" class='border-pink display-lg-none'>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label='Column 1'>
        1
      </td>
      <td data-label='Column 2'>
        <p
          class='text-ellipsis'          
        >
          Column 2
        </p>
      </td>
      <td data-label='Column 3'>
        <p
          class='text-ellipsis'
        >
          Column 3
        </p>
      </td>
      <td class='wrapper-buttons' data-label='Actions'>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-play"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-edit"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-dollar-sign"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
    <tr>
      <td data-label='Column 1'>
        2
      </td>
      <td data-label='Column 2'>
        <p
          class='text-ellipsis'
        >
          Column 2
        </p>
      </td>
      <td data-label='Column 3'>
        <p
          class='text-ellipsis'
        >
          Column 3
        </p>
      </td>
      <td class='wrapper-buttons' data-label='Actions'>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-play"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-edit"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-dollar-sign"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
    <tr>
      <td data-label='Column 1'>
        3
      </td>
      <td data-label='Column 2'>
        <p
          class='text-ellipsis'
        >
          Column 2
        </p>
      </td>
      <td data-label='Column 3'>
        <p
          class='text-ellipsis'
        >
          Column 3
        </p>
      </td>
      <td class='wrapper-buttons' data-label='Actions'>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-play"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-edit"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-dollar-sign"></i>
        </button>
        <button
          class='button rounded button-gray border-transparent inverted p-1 mx-1'
          style='font-size: 12px; width: 30px; height: 30px;'
        >
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>

```html
<table class="table">
  ...
  <tbody>
    ...
      <td class='wrapper-buttons' data-label='Actions'>
       <!-- Bottons or other elements here -->
      </td>
  ...
```
