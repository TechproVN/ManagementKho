$(() => {
  $('#txtCode_1').focus();
  $('#txtCode_1').on('input', compareCode);
  $('#txtCode_2').on('input', compareCode);
})

let checkedAt = 1;

async function compareCode() {
  if(checkedAt == 1) {
    checkedAt = 2;
    $('#txtCode_2').focus();
  }else{
    checkedAt = 1;
    $('#txtCode_1').focus();
  }
  let code1 = $('#txtCode_1').val();
  let code2 = $('#txtCode_2').val();
  if(code1 == '') return;
  if (code1 == code2) {
    showAlertSuccess('Codes are the same', '', 500);
    $('#txtCode_1').val('').focus()
    $('#txtCode_2').val('')
    checkedAt = 1;
  }
}