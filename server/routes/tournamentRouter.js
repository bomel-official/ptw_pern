const express = require('express')
const TournamentController = require("../controllers/tournamentController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')
const AuthMiddleware = require('./../middleware/AuthMiddleware')

router.post('/create', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.create)
router.post('/edit', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.edit)
router.get('/get-all', TournamentController.getAll)
router.get('/get-participants', TournamentController.getParticipants)
router.get('/:slug', TournamentController.getById)
router.post('/register', AuthMiddleware, TournamentController.register)
router.post('/edit-register', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.editRegister)


module.exports = router