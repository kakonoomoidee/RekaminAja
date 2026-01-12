const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");

// LIST
router.get("/", doctorController.index);

// ADD
router.get("/add", doctorController.addPage);
router.post("/add", doctorController.store);

// DETAIL
router.get("/:doctorIdHash", doctorController.show);

// EDIT
router.get("/:doctorIdHash/edit", doctorController.editPage);
router.post("/:doctorIdHash/edit", doctorController.update);

// DELETE
router.post("/:doctorIdHash/delete", doctorController.destroy);

module.exports = router;
