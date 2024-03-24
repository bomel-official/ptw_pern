const express = require('express')
const CheckRoleMiddleware = require("../middleware/CheckRoleMiddleware");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const BuildController = require("../controllers/buildController");
const router = express.Router()

router.post('/admin/:object/create', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), BuildController.create)
router.post('/admin/:object/edit', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), BuildController.edit)
router.get('/admin/:object/get-all', BuildController.getAll)
router.get('/admin/:object/get-one', BuildController.getOne)
router.post('/admin/:object/delete', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), BuildController.delete)

router.post('/create', AuthMiddleware, BuildController.buildCreate)
router.post('/like', AuthMiddleware, BuildController.like)
router.post('/delete', AuthMiddleware, BuildController.buildDelete)
router.post('/toggle-meta', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), BuildController.buildToggleIsMeta)
router.get('/search', BuildController.buildSearch)
router.get('/attachment/get-all-included', BuildController.buildAttachmentGetAllIncluded)


module.exports = router