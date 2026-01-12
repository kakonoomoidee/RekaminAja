const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");

router.get("/", patientController.index);
router.get("/add", patientController.addPage);
router.post("/add", patientController.store);

router.get("/:nikHash", patientController.show);
router.get("/:nikHash/edit", patientController.editPage);
router.post("/:nikHash/edit", patientController.update);
router.post("/:nikHash/delete", patientController.destroy);

module.exports = router;
