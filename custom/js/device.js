$(() => {
  // $('#btnInsertDevice').click(insertDevice);
  // $('#txtInsertSerial').on('input', e => {
  //   setTimeout(() => {
  //     insertDevice();
  //   });
  // })
  $('#txtFilterDevice').on('input', filterDevices);
  $('#btnExport').click(exportToExxcel)
  showDevices();
})

let arrCurrentDevices = [];
let interval = setInterval(insertDevice, 2000);

function setIntervalForInsert(){
  interval = setInterval(insertDevice, 2000);
}

function showModalInsertDevice(){
  $('#txtInsertCode').val('');
  $('#txtInsertSerial').val('');
  $('#modalInsert').modal('show');
}

function renderExportTbl(){
  let $table = $(`#tblDeviceExport`);
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">QRCode</th>
      <th class="trn">Tên hàng</th>
      <th class="trn">Tên nhà SX</th>
      <th class="trn">Loại hàng hóa</th>
      <th class="trn">Lô nhập khẩu</th>
      <th class="trn">Thông số KT</th>
    </tr>
  `)
  if (arrCurrentDevices) {
    arrCurrentDevices.forEach((device, index) => {
      const { sProductCode, sProductName, sVendorName, sCountryName, sLocationName, sSerialNumber, sQrCode } = device
      $tbody.append(`
        <tr>
          <td>${sQrCode}</td>
          <td>${sProductCode} - ${sProductName}</td>
          <td>${sVendorName} - ${sCountryName}</td>
          <td>${sProductName}</td>
          <td>2017</td>
          <td>Xem tài liệu đính kèm</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
}

function exportToExxcel(){
  renderExportTbl();
  // $('#modalExport').modal('show');
  setTimeout(() => {
    $("#tblDeviceExport").table2excel({
      // exclude CSS class
      // exclude: ".noExl",
      name: "Report",
      filename: "data-device",//do not include extension
      // fileext: ".xls",
      // exclude_img: true,
      // exclude_links: true,
      // exclude_inputs: true
    });
  }, 200);
}

async function insertDevice(){
  let sProductCode = $('#txtInsertCode').val();
  let sSerialNumber = $('#txtInsertSerial').val();
  let { valid } = checkValidate(sProductCode, sSerialNumber);
  if(!valid) return;
  let sentData = { sProductCode, sSerialNumber };
  let res = await Service.updateDevice(sentData);
  let { Result } = JSON.parse(res)[0];
  console.log(res);
  if(Result != 1) {
    showAlertError('Không thể thêm thiết bị!!!', '', 1000);
  }
  $('#txtInsertSerial').val('').focus();
  clearInterval(interval);
  showAlertSuccess('Thêm thành công!!!', '', 2000);
  showDevices();
  setIntervalForInsert();
}

function clearInputInsertDevice(){
  $('#txtInsertSerial').val('').focus();
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
      <th class="trn">Số Seri</th>
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
  arrCurrentDevices = data;
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

function filterDevices(e){
  let val = e.target.value;
  if(val.trim() == '') return showPagination(arrCurrentDevices);
  let arr = arrCurrentDevices.filter(device => {
    let deviceName = removeUnicode(device.sProductName).toLowerCase();
    val = removeUnicode(val).toLowerCase();
    return deviceName.indexOf(val) > -1;
  })
  showPagination(arr);
}