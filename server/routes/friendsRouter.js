const express = require("express");
const FriendsRouter = require("../controllers/friendsController");
const authMiddleware = require("../middleware/AuthMiddleware");
const router = express.Router()


router.get('/friends/:id', FriendsRouter.getFriends)
router.get('/friend-requests/:id', FriendsRouter.getFriendRequests)
router.post('/add-friend/', authMiddleware, FriendsRouter.addFriend)
router.post('/remove-friend/', authMiddleware, FriendsRouter.removeFriend)

module.exports = router
