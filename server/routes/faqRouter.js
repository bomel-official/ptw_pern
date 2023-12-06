const express = require('express')
const FaqController = require("../controllers/faqController");
const router = express.Router()
const authMiddleware = require('./../middleware/AuthMiddleware')
const CheckRoleMiddleware = require("../middleware/CheckRoleMiddleware");

router.post('/edit', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), FaqController.edit)
router.post('/delete', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), FaqController.delete)
router.post('/create', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), FaqController.create)

router.get('/get-all', CheckRoleMiddleware(["ADMIN", "SUPERADMIN"]), FaqController.getAll)


module.exports = router