$(() => {
  showProducts();
  $('#txtFilterProduct').on('input', filterProducts);
})

let arrProducts = [];
let arrFilteredProducts = [];

function renderProductTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblProduct"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">#</th>
      <th class="trn">Mã sản phẩm</th>
      <th class="trn">Tên sản phẩm</th>
      <th class="trn">Tên doanh nghiệp</th>
      <th class="trn">Quốc gia</th>
      <th class="trn">Mô tả</th>
      <th class="trn">Số lượng hiện tại</th>
      <th class="trn">Số lượng</th>
      <th class="trn"></th>
    </tr>
  `)
  if (data) {
    data.forEach((product, index) => {
      const {dQuantity, dQuantityCurrent, iProductID, sCountryName, sProductCode, sProductDescription, sProductName, sVendorName } = product
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sProductCode}</td>
          <td class="text-left">${sProductName}</td>
          <td>${sVendorName}</td>
          <td>${sCountryName}</td>
          <td>${sProductDescription}</td>
          <td>${dQuantityCurrent}</td>
          <td>${dQuantity}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-success btn-custom-small dropdown-item btnShowAddModal trn">Add</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnLock trn">Lock</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnLock').last().click(() => {
        lockProduct(product);
      })
      $tbody.find('.btnShowAddModal').last().click(() => {
        showAddModal(product);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function lockProduct(product){}


function showAddModal(product){}


function showPagination(data){
  $('#totalProducts').html(`<strong class="trn">Sỗ sản phẩm</strong>: ${data.length}`);
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-yellow paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderProductTable(data);
      $('.card-product .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function filterProducts(e){
  let val = e.target.value;
  if(val.trim() == '') return showPagination(arrProducts);
  let arr = arrProducts.filter(p => {
    val = removeUnicode(val).toLowerCase();
    let proName = removeUnicode(p.sProductName).toLowerCase();
    return proName.indexOf(val) > -1;      
  })
  showPagination(arr);
}

async function showProducts(){
  let data = await Service.getDataProduct();
  if(data) {
    arrProducts = data;
    showPagination(data);
  }
  else {
    resetTblAssets();
    showAlertError("Không có data", "", 3000);
    arrProducts = [];
  }
  setDefaultLang();
}

function resetTblAssets(){
  $('#totalProducts').html('');
  $('#pagingControl').html('');
  $('#tblProduct').html('');
}