$(() => {
  showProducts();
})

async function showProducts(){
  let data = await Service.getDataProduct();
  console.log(data);
}

function renderProductTable(data) {
  let $table = $('#tblProduct')
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
    <tr>
      <th class="trn">#</th>
    </tr>
  `)
  let $checkboxHead = $thead.find('.checkbox-all-guards');
  if (data) {
    data.forEach((product, index) => {
      const {  } = product
      
      $tbody.append(`
        <tr>
          <td class="trn"></td>
        </tr>
      `)
      
    })
  }
  $table.append($thead).append($tbody);
}