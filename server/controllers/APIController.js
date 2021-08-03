const MD5 = require('md5');
const Axios = require('axios');
const querystring = require('querystring')

const API = Axios.create({
  baseURL: 'http://e-oms.idexpress.com',
});

class Controller {
  static getCost = async (req, res) => {
    try {
      let ongkirSTD = 0, ongkirSMD = 0, ongkirDlite = 0, ongkirDtruck
      let data = { ...req.query }
console.log(data)
      data.expressType = '00'
      let signSTD = MD5(`${JSON.stringify(data)}${process.env.APP_ID}${process.env.SECURITY_KEY}`)

      let newDataSTD = {
        data: JSON.stringify(data),
        appId: process.env.APP_ID,
        sign: signSTD
      }

      let getDataSTD = await API.post('/open/v1/waybill/get-standard-fee',
        querystring.stringify(newDataSTD),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      ongkirSTD = getDataSTD.data.data
      console.log('getDataSTD.data', getDataSTD.data)

      // data.expressType = '01'
      // let signSMD = MD5(`${JSON.stringify(data)}${env.APP_ID}${env.SECURITY_KEY}`)

      // let newDataSMD = {
      //   data: JSON.stringify(data),
      //   appId: 100132,
      //   sign: signSMD
      // }

      // let getDataSMD = await API.post('/open/v1/waybill/get-standard-fee',
      //   querystring.stringify(newDataSMD),
      //   {
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded"
      //     }
      //   })
      // ongkirSMD = getDataSMD.data.data

      if (data.weight <= 0.51) {
        data.expressType = '03'
        let signDlite = MD5(`${JSON.stringify(data)}${process.env.APP_ID}${process.env.SECURITY_KEY}`)

        let newDataDlite = {
          data: JSON.stringify(data),
          appId: process.env.APP_ID,
          sign: signDlite
        }

        let getDataDlite = await API.post('/open/v1/waybill/get-standard-fee',
          querystring.stringify(newDataDlite),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
        ongkirDlite = getDataDlite.data.data
      console.log('getDataDlite.data', getDataDlite.data)

      }


      return res.status(200).json({
        data:
          [
            { type: 'Standar', cost: +ongkirSTD, code: '00' },
            // { type: 'Same Day', cost: +ongkirSMD, code: '01' },
            { type: 'Dlite', cost: +ongkirDlite, code: '03' }]
      });

    } catch (error) {
      return res.status(400).json(error);
    }

    // const { destination, weight, courier } = req.query;
    //   const {
    //     data: { rajaongkir },
    //   } = await axios.post("/cost", {
    //     origin: "152",
    //     destination,
    //     weight,
    //     courier,
    //   });
    //   return res.status(200).json(rajaongkir);

  };
}

module.exports = Controller;
