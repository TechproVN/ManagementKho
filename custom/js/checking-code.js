$(() => {
  $('#txtProCode').focus();
  $('#txtSerial').on('input', () => {
    compareCode();
  });
})

async function compareCode() {
  let proCode = $('#txtProCode').val();
  let serial = $('#txtSerial').val();
  if(serial.trim() == '') return;
  if(proCode.trim() == '') return;
  let dotIndex = proCode.indexOf(':');
  if(dotIndex == -1) return;
  if (proCode.substring(dotIndex + 1) == serial) {
    let msg = `${proCode} trùng với ${serial}`
    showAlertSuccess(msg , '',);
    $('#txtProCode').val('').focus()
    $('#txtSerial').val('')
  }else $('#txtSerial').val('')
}