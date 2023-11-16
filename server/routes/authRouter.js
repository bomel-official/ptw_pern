const express = require('express')
const AuthController = require("../controllers/authController");
const router = express.Router()

// Discord OAuth redirect
router.get('/discord',  AuthController.discord)
router.get('/discord-redirect', AuthController.discordRedirect)

module.exports = router