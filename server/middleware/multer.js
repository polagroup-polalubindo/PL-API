const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./assets",
  filename: function (req, file, cb) {
    const newData = JSON.parse(req.body.data);
    cb(null, `${newData.namaProduk}.jpeg`);
  },
});
const upload = multer({
  storage: storage,
});
module.exports = upload;
