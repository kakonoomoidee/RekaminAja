const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");

// LIST
router.get("/", patientController.index);

// ADD
router.get("/add", patientController.addPage);
router.post("/add", patientController.store);

// DETAIL
router.get("/:nikHash", patientController.show);

// EDIT
router.get("/:nikHash/edit", patientController.editPage);
router.post("/:nikHash/edit", patientController.update);

// DELETE
router.post("/:nikHash/delete", patientController.destroy);

module.exports = router;
