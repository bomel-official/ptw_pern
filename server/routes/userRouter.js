const express = require('express')
const UserController = require("../controllers/userController");
const router = express.Router()
const authMiddleware = require('./../middleware/AuthMiddleware')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/edit', authMiddleware, UserController.edit)
router.get('/auth', authMiddleware, UserController.check)
router.post('/lostpassoword') // todo
router.get('/', UserController.search)
router.get('/:id', UserController.getOne)
router.get('/nickname/:nickname', UserController.getOneByNickname)
router.post('/renew', UserController.renew)

module.exports = router