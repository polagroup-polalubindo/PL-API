const machine = require("express").Router();
const controller = require("../../controllers/machineController");
const authentication = require("../../middleware/authentication");

machine.post("/machine", authentication, controller.tambahMachine);
machine.get("/machine", authentication, controller.getAllMachine);
machine.get("/machine/:id", controller.getOneMachine);
machine.put("/machine/:id", authentication, controller.editMachine);
machine.delete("/machine/:id", authentication, controller.deleteMachine);

module.exports = machine;
