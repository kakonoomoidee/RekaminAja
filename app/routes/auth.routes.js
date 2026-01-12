const express = require("express");
const router = express.Router();

const { loginPage, login, logout } = require("../controllers/auth.controller");

router.get("/", loginPage);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
