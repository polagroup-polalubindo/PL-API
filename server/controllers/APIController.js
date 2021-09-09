require("dotenv").config();
const { Transaksi, District, City } = require('../models')
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

      // if (data.weight <= 0.51) {
      //   data.expressType = '03'
      //   let signDlite = MD5(`${JSON.stringify(data)}${process.env.APP_ID}${process.env.SECURITY_KEY}`)

      //   let newDataDlite = {
      //     data: JSON.stringify(data),
      //     appId: process.env.APP_ID,
      //     sign: signDlite
      //   }

      //   let getDataDlite = await API.post('/open/v1/waybill/get-standard-fee',
      //     querystring.stringify(newDataDlite),
      //     {
      //       headers: {
      //         "Content-Type": "application/x-www-form-urlencoded"
      //       }
      //     })
      //   ongkirDlite = getDataDlite.data.data
      //   console.log('getDataDlite.data', getDataDlite.data)

      // }


      return res.status(200).json({
        data:
          [
            { type: 'Standar', cost: +ongkirSTD, code: '00' },
            // { type: 'Same Day', cost: +ongkirSMD, code: '01' },
            // { type: 'Dlite', cost: +ongkirDlite, code: '03' }
          ]
      });

    } catch (error) {
      return res.status(500).json(error);
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

  static tracking = async (req, res) => {
    try {
      let waybillNo = req.params.waybillNo, newHistory = [], transactionSelected
      let sign = MD5(`${waybillNo}${process.env.APP_ID}${process.env.SECURITY_KEY}`)
      let { data } = await API.get(`/open/v1/waybill/get-tracking?data=${waybillNo}&appId=${process.env.APP_ID}&sign=${sign}`)

      // let data = {
      //   "code": 0,
      //   "desc": null,
      //   "total": null,
      //   "data": {
      //     "basicInfo": {
      //       "orderNo": "XXXXXXXXXXXX",
      //       "waybillNo": "XXXXXXXXXXXX",
      //       "orderTime": 1620208358000
      //     },
      //     "itemInfo": {
      //       "itemName": "XXXXXXXXXXXX",
      //       "insured": "No",
      //       "itemRemarks": "",
      //       "itemQuantity": 1,
      //       "itemCategory": "Items",
      //       "weight": "0.3000000000",
      //       "length": 0,
      //       "width": 0,
      //       "height": 0,
      //       "insuranceAmount": "0E-8",
      //       "itemValue": "290000.00000000"
      //     },
      //     "senderInfo": {
      //       "senderName": "XXXXXXXXXXXX",
      //       "senderEmail": null,
      //       "senderPhoneNumber": "XXXXXXXXXXX",
      //       "senderCellphone": "XXXXXXXXXXX",
      //       "senderProvince": "JAWA TIMUR",
      //       "senderCity": "SURABAYA",
      //       "senderDistrict": null,
      //       "senderAddress": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      //       "recipientZipCode": null
      //     },
      //     "recipientInfo": {
      //       "recipientName": "Prasetio",
      //       "recipientEmail": null,
      //       "recipientPhoneNumber": "XXXXXXXXXXXXX",
      //       "recipientCellphone": "XXXXXXXXXXXX",
      //       "recipientProvince": "NTB",
      //       "recipientCity": "SUMBAWA",
      //       "recipientDistrict": "SUMBAWA",
      //       "recipientAddress": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      //       "recipientZipCode": null
      //     },
      //     "history": [
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "POD scan",
      //         "operationTime": 1621648433000,
      //         "courierName": "Ariadi",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": "ibu eti",
      //         "problemCode": null,
      //         "relation": "Siblings",
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Delivery scan",
      //         "operationTime": 1621648106000,
      //         "courierName": "Ariadi",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Problem On Shipment scan",
      //         "operationTime": 1621583716000,
      //         "courierName": "Ariadi",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": "102",
      //         "relation": null,
      //         "description": "The shipment has been marked as 【Pickup Failure】, the problem reason is 【Pelanggan tidak di tempat】, and the operator is 【Ariadi】"
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Delivery scan",
      //         "operationTime": 1621583644000,
      //         "courierName": "Ariadi",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Problem On Shipment scan",
      //         "operationTime": 1621583506000,
      //         "courierName": "Ariadi",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": "102",
      //         "relation": null,
      //         "description": "The shipment has been marked as 【Pickup Failure】, the problem reason is 【Pelanggan tidak di tempat】, and the operator is 【Ariadi】"
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Delivery scan",
      //         "operationTime": 1621559212000,
      //         "courierName": "Ariadi",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unpacking scan",
      //         "operationTime": 1621558952000,
      //         "courierName": "Bambang Zulkarnaen",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1621558751000,
      //         "courierName": "Bambang Zulkarnaen",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1621558720000,
      //         "courierName": "Bambang Zulkarnaen",
      //         "currentBranch": "TH SUMBAWA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1621424556000,
      //         "courierName": "I Gede Pebra Arisdianta",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": "MH SUMBAWA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1621424523000,
      //         "courierName": "I Gede Pebra Arisdianta",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1621424411000,
      //         "courierName": "I Gede Pebra Arisdianta",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unpacking scan",
      //         "operationTime": 1621331008000,
      //         "courierName": "I Kadek Sumerta Jaya",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1621330525000,
      //         "courierName": "Security DPS 1",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1621221128000,
      //         "courierName": "EKI NOVANDA SAPUTRA",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": "MH DENPASAR",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1621219394000,
      //         "courierName": "EKI NOVANDA SAPUTRA",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1621068411000,
      //         "courierName": "AWAL NUR HIDAYAT",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unpacking scan",
      //         "operationTime": 1621067896000,
      //         "courierName": "TRI HARDIANTO",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1621067265000,
      //         "courierName": "ADITYA ARMANDA",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1621065319000,
      //         "courierName": "Security MH JKT 1",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1621024441000,
      //         "courierName": "Bangun Widodo",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": "MH JAKARTA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1621018616000,
      //         "courierName": "Dodik Adi Putra",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1621018609000,
      //         "courierName": "Bangun Widodo",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1621018507000,
      //         "courierName": "Doni Adi Prastyo",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1621005201000,
      //         "courierName": "DICKY TRIPUTRADYANTO",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": "MH SURAKARTA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1621004932000,
      //         "courierName": "SAHRUL LABIB ",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1620998502000,
      //         "courierName": "DANDY RAHMANTO",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unpacking scan",
      //         "operationTime": 1620947993000,
      //         "courierName": "DICKY TRIPUTRADYANTO",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620947336000,
      //         "courierName": "ANGGA ADITYA PRATAMA",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620947218000,
      //         "courierName": "HARRI P. (Security)",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620931666000,
      //         "courierName": "Adi Suyanto",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": "MH SURABAYA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620906826000,
      //         "courierName": "Riski Wahyudi",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620906099000,
      //         "courierName": "Riski Wahyudi",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620905901000,
      //         "courierName": "Syafi'il Anam (Security)",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620871439000,
      //         "courierName": "I Gede Pebra Arisdianta",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": "MH JEMBER",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620860193000,
      //         "courierName": "I Nyoman Adi Wiguna",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1620819525000,
      //         "courierName": "I Gede Pebra Arisdianta",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unpacking scan",
      //         "operationTime": 1620805795000,
      //         "courierName": "Muhammad Septian hadi",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620803903000,
      //         "courierName": "I Putu Agus Hery Darma Saputra",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620802366000,
      //         "courierName": "Security DPS 1",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620692450000,
      //         "courierName": "IAN ZULFIKRI",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": "MH DENPASAR",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620689964000,
      //         "courierName": "EKI NOVANDA SAPUTRA",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620687095000,
      //         "courierName": "FIKRI CHAIKAL R.",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620686894000,
      //         "courierName": "Security MH JKT 1",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620639163000,
      //         "courierName": "Adi Nugroho",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": "MH JAKARTA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620637223000,
      //         "courierName": "Andrian Pangestu Putra Bawono",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620634399000,
      //         "courierName": "Ariyono",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620634328000,
      //         "courierName": "Ariyono",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620618271000,
      //         "courierName": "BAGUS INDRA CAHYONO",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": "MH SURAKARTA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620615749000,
      //         "courierName": "REYNALDI AULIA AS'ARI",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620603403000,
      //         "courierName": "CHOIRUL UMAM M. AL AMIN ",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620602907000,
      //         "courierName": "HARRI P. (Security)",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620585779000,
      //         "courierName": "Wahyu Erwin Syah Putra",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": "MH SURABAYA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620560852000,
      //         "courierName": "Lutfy Antika T.P",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620560530000,
      //         "courierName": "Khoiri Rofiki Abdillah",
      //         "currentBranch": "MH JEMBER",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620527322000,
      //         "courierName": "I Gede Susila",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1620526874000,
      //         "courierName": "I Gede Susila",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unpacking scan",
      //         "operationTime": 1620526370000,
      //         "courierName": "Putu Surya Febrianto",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620523905000,
      //         "courierName": "I Geder Rika Sandrawan",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620515864000,
      //         "courierName": "Security DPS 1",
      //         "currentBranch": "MH DENPASAR",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1582821154000,
      //         "courierName": "ABDILLAH FARHAN",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": "MH DENPASAR",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620348643000,
      //         "courierName": "ADITIA APRILIYANTO",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1582825106000,
      //         "courierName": "AGUS PRAYITNO",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620325689000,
      //         "courierName": "DERI TRI HARTONO",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620324646000,
      //         "courierName": "ABDUL AJIS",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620323838000,
      //         "courierName": "Security MH JKT 1",
      //         "currentBranch": "MH JAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620319451000,
      //         "courierName": "Andri Saepul Anwar",
      //         "currentBranch": "MH KARAWANG",
      //         "nextBranchName": "MH JAKARTA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620318608000,
      //         "courierName": "Arif Jarkasih",
      //         "currentBranch": "MH KARAWANG",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620318593000,
      //         "courierName": "Angga Setiawan",
      //         "currentBranch": "MH KARAWANG",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620318041000,
      //         "courierName": "SecurityKRW2",
      //         "currentBranch": "MH KARAWANG",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620302472000,
      //         "courierName": "Arifian Al Ayubi",
      //         "currentBranch": "MH TEGAL",
      //         "nextBranchName": "MH KARAWANG",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620300411000,
      //         "courierName": "Pungki Febrian",
      //         "currentBranch": "MH TEGAL",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620340317000,
      //         "courierName": "Bayu Prasetyo",
      //         "currentBranch": "MH TEGAL",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620295932000,
      //         "courierName": "M. Ali Saefudin",
      //         "currentBranch": "MH TEGAL",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620280005000,
      //         "courierName": "Bangun Widodo",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": "MH TEGAL",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620268691000,
      //         "courierName": "Rio Bagus Wicaksono",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620268691000,
      //         "courierName": "Rio Bagus Wicaksono",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620264338000,
      //         "courierName": "Brian Ergo Ariyanto",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620262592000,
      //         "courierName": "Doni Adi Prastyo",
      //         "currentBranch": "MH SURAKARTA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620246141000,
      //         "courierName": "ANTON ANDRI AFAN ",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": "MH SURAKARTA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620245003000,
      //         "courierName": "RIA ARIS PRATAMA",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Packing scan",
      //         "operationTime": 1620244273000,
      //         "courierName": "SONNY DWI YULIANTO",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Unloading scan",
      //         "operationTime": 1620237989000,
      //         "courierName": "MOHAMMAD MUHLIS ALFATHONI",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Arrival scan",
      //         "operationTime": 1620236930000,
      //         "courierName": "HARRI P. (Security)",
      //         "currentBranch": "MH SURABAYA",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Sending scan",
      //         "operationTime": 1620230299000,
      //         "courierName": "Dimas Fajar K",
      //         "currentBranch": "TH TANDES",
      //         "nextBranchName": "MH SURABAYA",
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Loading scan",
      //         "operationTime": 1620228353000,
      //         "courierName": "Dimas Fajar K",
      //         "currentBranch": "TH TANDES",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       },
      //       {
      //         "waybillNo": "XXXXXXXXXXXX",
      //         "operationType": "Pick up scan",
      //         "operationTime": 1620221571000,
      //         "courierName": "M.Herlis Faisyabil",
      //         "currentBranch": "TH TANDES",
      //         "nextBranchName": null,
      //         "signer": null,
      //         "problemCode": null,
      //         "relation": null,
      //         "description": null
      //       }
      //     ]
      //   }
      // }
      // console.log(data)

      if (data.code === 0) {
        transactionSelected = await Transaksi.findOne({ where: { noResi: waybillNo }, include: [{ model: District, attribute: ['id', 'name'] }, { model: City, attribute: ['id', 'name'] }] })

        newHistory = (data.data?.history.length > 0 && await data.data.history.filter(el =>
          el.operationType === "Pick up scan" ||
          el.operationType === "Problem On Shipment scan" ||
          (el.operationType === "Arrival scan" && el.currentBranch.slice(3) === transactionSelected.District?.name) ||
          el.operationType === "Delivery scan" ||
          el.operationType === "POD scan" ||
          el.operationType === "Create Return Bill" ||
          el.operationType === "Confirm Return Bil" ||
          el.operationType === "Return POD Scan"
        )) || []
      } else {
        throw data
      }

      return res.status(200).json({
        noResi: waybillNo,
        tanggalPengiriman: data.data?.basicInfo?.orderTime || transactionSelected.tanggalPengiriman,
        kurir: `${transactionSelected.kurir} (${transactionSelected.serviceKurir})`,
        namaPembeli: transactionSelected.namaPenerima,
        kecamatan: transactionSelected.District.name,
        kota: transactionSelected.City.name,
        historys: newHistory
      });

    } catch (error) {
      console.log(error)
      return res.status(500).json(error);
    }
  }
}

module.exports = Controller;
