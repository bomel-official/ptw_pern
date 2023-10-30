const express = require('express')
const TournamentController = require("../controllers/tournamentController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')

router.post('/create', CheckRoleMiddleware("ADMIN"), TournamentController.create)
router.get('/get-all', TournamentController.getAll)
router.get('/:slug', TournamentController.getById)


module.exports = router