$(() => {
  // $('#btnInsertDevice').click(insertDevice);
  $('#txtInsertSerial').on('input', e => {
    let val = e.target.value;
    if(val.length < 13) return;
    else insertDevice();
  })
  showDevices();
})

let isInserted = false;

function showModalInsertDevice(){
  $('#txtInsertCode').val('');
  $('#txtInsertSerial').val('');
  $('#modalInsert').modal('show');
}

async function insertDevice(){
  let sProductCode = $('#txtInsertCode').val();
  let sSerialNumber = $('#txtInsertSerial').val();
  let { msgErr, valid } = checkValidate(sProductCode, sSerialNumber);
  if(!valid) return showAlertError('', msgErr);
  let sentData = { sProductCode, sSerialNumber };
  let res = await Service.updateDevice(sentData);
  let { Result } = JSON.parse(res)[0];
  console.log(res);
  if(Result != 1) 
    return showAlertError('Không thể thêm thiết bị!!!', '', 4000);
  showAlertSuccess('Thêm thành công!!!', '', 4000);
  clearInputInsertDevice();
  showDevices();
}

function clearInputInsertDevice(){
  $('#txtInsertSerial').val('');
  $('#txtInsertCode').val('');
}

function checkValidate(code, serial){
  let msgErr = '';
  let valid = true;
  if(!Validation.checkNotEmpty(code)){
    valid = false;
    msgErr += 'Code không được để trống!!\n'
  }
  if(!Validation.checkNotEmpty(serial)){
    valid = false;
    msgErr += 'Serial không được để trống!!\n'
  }
  return { msgErr, valid };
}

function renderDeviceTable(data){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblDevice"></table>`)
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
      <th class="trn">Vị trí</th>
      <th class="trn">Só Seri</th>
      <th class="trn">QRCode</th>
    </tr>
  `)
  if (data) {
    data.forEach((device, index) => {
      const { sProductCode, sProductName, sVendorName, sCountryName, sLocationName, sSerialNumber, sQrCode } = device
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sProductCode}</td>
          <td>${sProductName}</td>
          <td>${sVendorName}</td>
          <td>${sCountryName}</td>
          <td>${sLocationName}</td>
          <td>${sSerialNumber}</td>
          <td>${sQrCode}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showPagination(data){
  $('#totalDevices').html(`<strong class="trn">Sỗ thiết bị</strong>: ${data.length}`);
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-yellow paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderDeviceTable(data);
      $('.card-device .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

async function showDevices(){
  let data = await Service.getDataDevice();
  console.log(data);
  if(data) showPagination(data);

  else {
    resetTblAssets();
    showAlertError("Không có data", "", 3000);
  }
  setDefaultLang();
}

function resetTblAssets(){
  $('#totalDevices').html('');
  $('#pagingControl').html('');
  $('#tblDevice').html('');
}