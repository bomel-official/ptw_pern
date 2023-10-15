const express = require('express')
const TeamController = require("../controllers/teamController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')

// router.post('/', CheckRoleMiddleware("ADMIN"), TeamController.create)
router.get('/')
router.get('/:id')


module.exports = router