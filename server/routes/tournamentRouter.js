const express = require('express')
const TournamentController = require("../controllers/tournamentController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')
const AuthMiddleware = require('./../middleware/AuthMiddleware')

router.post('/create', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.create)
router.post('/edit', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.edit)
router.post('/redeclare-room', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.redeclareRoom)
router.get('/get-all', TournamentController.getAll)
router.get('/get-participants', TournamentController.getParticipants)
router.get('/get-own-participant', TournamentController.getOwnParticipant)
router.get('/get-pay-url', TournamentController.getPayUrl)
router.get('/get-pay-info', TournamentController.getParticipantInvoiceInfo)
router.get('/:slug', TournamentController.getById)
router.post('/register', AuthMiddleware, TournamentController.register)
router.post('/unregister', AuthMiddleware, TournamentController.unregister)
router.post('/edit-register', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.editRegister)
router.post('/change-pay-status', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.changeIsPaidStatus)
router.post('/increase-priority', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), TournamentController.increasePriority)


module.exports = router