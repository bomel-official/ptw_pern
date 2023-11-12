const express = require('express')
const CheckRoleMiddleware = require("../middleware/CheckRoleMiddleware");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const BuildController = require("../controllers/buildController");
const router = express.Router()

router.post('/admin/:object/create', CheckRoleMiddleware("ADMIN"), BuildController.create)
router.post('/admin/:object/edit', CheckRoleMiddleware("ADMIN"), BuildController.edit)
router.get('/admin/:object/get-all', BuildController.getAll)
router.get('/admin/:object/get-one', BuildController.getOne)
router.post('/admin/:object/delete', CheckRoleMiddleware("ADMIN"), BuildController.delete)

router.post('/create', AuthMiddleware, BuildController.buildCreate)
router.post('/delete', AuthMiddleware, BuildController.buildDelete)
router.get('/search', BuildController.buildSearch)
router.get('/attachment/get-all-included', BuildController.buildAttachmentGetAllIncluded)


module.exports = router