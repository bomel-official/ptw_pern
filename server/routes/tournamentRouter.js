const express = require('express')
const TournamentController = require("../controllers/tournamentController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')
const AuthMiddleware = require('./../middleware/AuthMiddleware')

router.post('/create', CheckRoleMiddleware("ADMIN"), TournamentController.create)
router.post('/edit', CheckRoleMiddleware("ADMIN"), TournamentController.edit)
router.get('/get-all', TournamentController.getAll)
router.get('/get-participants', TournamentController.getParticipants)
router.get('/:slug', TournamentController.getById)
router.post('/register', AuthMiddleware, TournamentController.register)


module.exports = router