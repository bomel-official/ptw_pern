const express = require('express')
const CheckRoleMiddleware = require("../middleware/CheckRoleMiddleware");
const TournamentController = require("../controllers/tournamentController");
const router = express.Router()

router.post('/weapon-type/create', CheckRoleMiddleware("ADMIN"), TournamentController.create)


module.exports = router