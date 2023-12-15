const express = require('express')
const QuestionController = require("../controllers/questionController");
const router = express.Router()
const CheckRoleMiddleware = require('./../middleware/CheckRoleMiddleware')

router.get('/get', QuestionController.get)
router.post('/save-create', CheckRoleMiddleware(['ADMIN', 'SUPERADMIN']), QuestionController.saveOrCreate)
router.post('/delete', CheckRoleMiddleware(['ADMIN', 'SUPERADMIN']), QuestionController.delete)


module.exports = router