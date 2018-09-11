
class Service {

  static handleData(data){
    if(!data) return null;
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static handleError(error){
    console.log(error.message);
    return null;
  }

  static async getDataProduct() {
    try {
      let data = await $.ajax({
        url: `${APP_DOMAIN}/Warehouse/GetDataProduct.php`,
        method: 'post',
        data: null
      });
      return Service.handleData(data);
    } catch (error) {
      return Service.handleError(error);
    }
  }

  static async getDataDevice() {
    try {
      let data = await $.ajax({
        url: `${APP_DOMAIN}/Warehouse/GetDataDevice.php`,
        method: 'post',
        data: null
      });
      return Service.handleData(data);
    } catch (error) {
      return Service.handleError(error);
    }
  }

  static async updateDevice(sentData) {
    try {
      let res = await $.ajax({
        url: `${APP_DOMAIN}/Warehouse/UpdateDevice.php`,
        method: 'post',
        data: JSON.stringify(sentData)
      });
      return res;
    } catch (error) {
      return Service.handleError(error);
    }
  }
  
}
