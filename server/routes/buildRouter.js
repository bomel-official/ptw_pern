const express = require('express')
const CheckRoleMiddleware = require("../middleware/CheckRoleMiddleware");
const BuildController = require("../controllers/buildController");
const router = express.Router()

router.post('/admin/:object/create', CheckRoleMiddleware("ADMIN"), BuildController.create)
router.post('/admin/:object/edit', CheckRoleMiddleware("ADMIN"), BuildController.edit)
router.get('/admin/:object/get-all', BuildController.getAll)
router.post('/admin/:object/delete', CheckRoleMiddleware("ADMIN"), BuildController.delete)


module.exports = router