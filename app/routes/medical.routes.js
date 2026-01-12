const express = require("express");
const router = express.Router();
const controller = require("../controllers/medical.controller");

router.get("/", controller.index);
router.get("/add", controller.addPage);
router.post("/add", controller.store);
router.get("/:patientHash/:index", controller.show);

module.exports = router;
