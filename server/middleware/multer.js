const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./",
  filename: function (req, file, cb) {
    const newData = JSON.parse(req.body.data);
    const ext = file.mimetype.split("/")[1];
    cb(null, `assets/${file.originalname}-${Date.now()}.${ext}`);
  },
});
const upload = multer({
  storage: storage,
});
module.exports = upload;
