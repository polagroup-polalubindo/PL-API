const { Transaksi, Warranty } = require('../models')
const Op = require('sequelize').Op
const cronJob = require("cron").CronJob;
const MD5 = require('md5');
const Axios = require('axios');
const querystring = require('querystring')

const API = Axios.create({
  baseURL: 'http://e-oms.idexpress.com',
});

async function rescheduleCRON() {
  // cancelOrderIdExpress('')


  // // ========================= TRACKING WAYBILL =========================
  // let signCheckOrder = MD5(`IDE004784713203${process.env.APP_ID}${process.env.SECURITY_KEY}`)

  // let checkOrderIdExpress = await API.get(`/open/v1/waybill/get-tracking?data=IDE004784713203&appId=${process.env.APP_ID}&sign=${signCheckOrder}`)
  // console.log("checkOrderIdExpress", checkOrderIdExpress.data)
  // // ========================= TRACKING WAYBILL =========================


  scheduleCreateOrderIdExpress()
  handleScheduleCancelExpiredTransaction()
  handleScheduleWarranty()
}


async function handleScheduleCancelExpiredTransaction() {
  let allTransactionHasExpired = await Transaksi.findAll({ where: { expiredAt: { [Op.gte]: new Date() } } })
  await allTransactionHasExpired.forEach(async (element) => {
    await scheduleCancelExpiredTransaction(element.id)
  });
}


async function scheduleCancelExpiredTransaction(id) {
  try {
    const dataSelected = await Transaksi.findByPk(id)

    if (dataSelected.expiredAt) {
      console.log('START scheduleCancelExpiredTransaction. ID TRANSACTION', id)
      var job = new cronJob(new Date(dataSelected.expiredAt), async function () {
        const dataCurrentSelected = await Transaksi.findByPk(id)

        if (dataCurrentSelected.expiredAt) {
          await Transaksi.update(
            {
              expiredAt: null,
              statusPesanan: 'dibatalkan',
              statusPembayaran: 'dibatalkan',
              statusPengiriman: 'dibatalkan',
            },
            {
              where: { id }
            }
          )
          console.log("SUKSES CRON")
        }
      });
      job.start();
    }
  } catch (err) {
    console.log('ERROR scheduleCancelExpiredTransaction. ID TRANSACTION', id)
    console.log(err)
  }
}


async function scheduleCreateOrderIdExpress() {
  // var job = new cronJob('0 47 12 * * *', async function () { //FOR TESTING
  var job = new cronJob('0 20 14 * * *', async function () { // BUAT ORDER SETIAP JAM 14.20
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let date = new Date().getDate()
    if (month < 10) month = `0${month}`
    if (date < 10) date = `0${date}`
    let today = `${year}-${month}-${date}`

    let getAllOrderWillSendToday = await Transaksi.findAll({ where: { tanggalPengiriman: new Date(today) } })
    console.log(getAllOrderWillSendToday)

    getAllOrderWillSendToday.forEach(async (transaction) => {
      let data = [{
        orderNo: transaction.orderNo,
        orderTime: Math.floor(Date.now() / 1000),
        expressType: transaction.expressType,
        itemName: transaction.itemName,
        insured: transaction.insurance ? '1' : '0',
        // itemRemarks,
        itemQuantity: transaction.itemQuantity,
        itemCategory: '00',
        weight: transaction.weight,
        // length,
        // width,
        // height,
        serviceType: '00',
        itemValue: transaction.insurance ? +transaction.insuranceFee : 0,
        senderName: 'PT Pola Lubindo',
        // senderEmail:
        senderCellPhone: '0215712644',
        // senderPhoneNumber,
        senderProvinceId: 1,
        senderCityId: 38,
        senderDistrictId: 14916,
        senderAddress: 'Jl. Penjernihan I No. 30',
        senderZipCode: '10210',
        recipientName: transaction.namaPenerima,
        // recipientEmail,
        recipientCellPhone: transaction.telfonPenerima,
        // recipientPhoneNumber,
        recipientProvinceId: transaction.recipientProvinceId,
        recipientCityId: transaction.recipientCityId,
        recipientDistrictId: transaction.recipientDistrictId,
        recipientAddress: transaction.recipientAddress,
        recipientZipCode: transaction.recipientZipCode,
        // codAmount,
        paymentType: '01',
        pickupStartTime: new Date(year, +month - 1, date, 19).getTime() / 1000,
        pickupEndTime: new Date(year, +month - 1, date, 23).getTime() / 1000
        // shippingClient
      }]
      console.log(data)
      let signDataOrder = MD5(`${JSON.stringify(data)}${process.env.APP_ID}${process.env.SECURITY_KEY}`)

      let newDataOrder = {
        data: JSON.stringify(data),
        appId: process.env.APP_ID,
        sign: signDataOrder
      }

      let createOrderIdExpress = await API.post('/open/v1/waybill/create',
        querystring.stringify(newDataOrder),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      console.log("createOrderIdExpress.data", createOrderIdExpress.data)
      // createOrderIdExpress.data {
      //   code: 0,
      //   desc: null,
      //   total: null,
      //   data: [
      //     {
      //       code: '0',
      //       orderNo: 'IDVK202107300013',
      //       waybillNo: 'IDE004784713203',
      //       sortingCode: 'TGR-TGR01-KTGR04',
      //       msg: null
      //     }
      //   ]
      // }

      // // contoh data balikan
      // let createOrderIdExpress = {
      //   data: {
      //     code: 0,
      //     desc: null,
      //     total: null,
      //     data: [
      //       {
      //         code: '0',
      //         orderNo: 'IDVK202107300014',
      //         waybillNo: 'IDE000874737534',
      //         sortingCode: 'TGR-TGR01-KTGR04',
      //         msg: null
      //       }
      //     ]
      //   }
      // }

      if (createOrderIdExpress.data.code === 0 && createOrderIdExpress.data.data[0].code === '0') { // JIKA BERHASIL
        console.log("MASUK SINI")
        await Transaksi.update({
          noResi: createOrderIdExpress.data.data[0].waybillNo,
          statusPengiriman: "dalam pengiriman",
          expiredAt: null,
        }, { where: { id: transaction.id } })

        // cancelOrderIdExpress(createOrderIdExpress.data.data[0].waybillNo)
      } else { // JIKA GAGAL
        console.log('>>>>>> ', createOrderIdExpress.data)
      }
    })
    // kirim jam 16.00
    console.log("SUKSES CRON", new Date())

  });
  job.start();
}


async function cancelOrderIdExpress(waybillNo) {
  try {
    let dataCancel = {
      waybillNo
    }
    let signCancelOrder = MD5(`${JSON.stringify(dataCancel)}${process.env.APP_ID}${process.env.SECURITY_KEY}`)

    let cancelOrder = {
      data: JSON.stringify(dataCancel),
      appId: process.env.APP_ID,
      sign: signCancelOrder
    }

    let cancelOrderIdExpressAPI = await API.post('/open/v1/waybill/cancel',
      querystring.stringify(cancelOrder),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
    console.log("cancelOrderIdExpress", cancelOrderIdExpressAPI.data)
    if (cancelOrderIdExpressAPI.data.code === 0) console.log('Order berhasil dicancel', dataCancel.waybillNo)
  } catch (err) {
    console.log('cancelOrderIdExpress error =>', err)
  }
}


async function handleScheduleWarranty() {
  let allWarranty = await Warranty.findAll({ where: { isValid: 1 } })
  await allWarranty.forEach(async (element) => {
    await scheduleWarranty(element.id)
  });
}

async function scheduleWarranty(id) {
  try {
    const dataSelected = await Warranty.findByPk(id)
    let newDate = new Date(dataSelected.purchaseDate).setFullYear(new Date(dataSelected.purchaseDate).getFullYear() + 1)

    console.log('START scheduleWarranty. ID WARRANTY', id)
    var job = new cronJob(new Date(newDate), async function () {
      const dataCurrentSelected = await Warranty.findByPk(id)

      if (dataSelected.purchaseDate === dataCurrentSelected.purchaseDate) {
        await Warranty.update(
          {
            isValid: 0
          },
          {
            where: { id }
          }
        )
        console.log('SUKSES scheduleWarranty. ID WARRANTY', id)
      }
    });
    job.start();

  } catch (err) {
    console.log('ERROR scheduleWarranty. ID WARRANTY', id)
    console.log(err)
  }
}

module.exports = {
  rescheduleCRON,
  scheduleCancelExpiredTransaction,
  scheduleWarranty
};