const alamat = require("express").Router();
const controller = require("../../controllers/alamatController");
const authentication = require("../../middleware/authentication");

alamat.post("/alamat", authentication, controller.tambahAlamat);
alamat.put("/edit-alamat", authentication, controller.editAlamat);
alamat.get("/alamat", authentication, controller.getAllAlamat);
alamat.delete("/delete-alamat/:id", authentication, controller.deleteAlamat);

module.exports = alamat;
