const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/admin.middleware");
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminMiddleware, adminController.dashboard);

module.exports = router;
