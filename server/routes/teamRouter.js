const express = require('express')
const TeamController = require("../controllers/teamController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')
const AuthMiddleware = require('./../middleware/AuthMiddleware')

router.get('/search', TeamController.search)
router.get('/:slug')
router.post('/save-create', AuthMiddleware, TeamController.saveOrCreate)
router.post('/delete-leave', AuthMiddleware, TeamController.deleteOrLeaveTeam)


module.exports = router