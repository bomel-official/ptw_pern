const express = require('express')
const TournamentController = require("../controllers/tournamentController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')

router.post('/', CheckRoleMiddleware("ADMIN"), TournamentController.create)
router.get('/')
router.get('/:id')


module.exports = router