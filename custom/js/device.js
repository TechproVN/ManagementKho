$(() => {
  $('#txtInsertDevice').click(insertDevice);
  $('#btnShowInsertDeviceModal').click(showModalInsertDevice);
  showDevices();
})

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
  console.log(res);
  showAlertSuccess('Update Successfully!!!', '', 4000);
  showDevices();
}

function checkValidate(code, serial){
  let msgErr = '';
  let valid = true;
  if(!Validation.checkNotEmpty(code)){
    valid = false;
    msgErr += 'Code must be filled!!\n'
  }
  if(!Validation.checkNotEmpty(serial)){
    valid = false;
    msgErr += 'Serial must be filled!!\n'
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
      <th class="trn">Product code</th>
      <th class="trn">Product name</th>
      <th class="trn">Vendor name</th>
      <th class="trn">Country</th>
      <th class="trn">Location</th>
      <th class="trn">Serial</th>
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
  $('#totalDevices').html(`<strong class="trn">Total Devices</strong>: ${data.length}`);
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
  if(data) showPagination(data);
  else {
    resetTblAssets();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblAssets(){
  $('#totalDevices').html('');
  $('#pagingControl').html('');
  $('#tblDevice').html('');
}