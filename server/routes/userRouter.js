const express = require('express')
const UserController = require("../controllers/userController");
const router = express.Router()
const authMiddleware = require('./../middleware/AuthMiddleware')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/edit', authMiddleware, UserController.edit)
router.get('/auth', authMiddleware, UserController.check)
router.post('/lostpassoword') // todo
router.post('/add-friend/', authMiddleware, UserController.addFriend)
router.post('/remove-friend/', authMiddleware, UserController.removeFriend)
router.get('/friends/:id', UserController.getFriends)
router.get('/', UserController.search)
router.get('/:id', UserController.getOne)
router.get('/nickname/:nickname', UserController.getOneByNickname)



module.exports = router