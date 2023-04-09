const express = require("express");
const { Login, logOut, Profile } = require("../controllers/Auth.js");

const router = express.Router();

router.get("/profile", Profile);
router.post("/login", Login);
router.delete("/logout", logOut);

module.exports = router;
