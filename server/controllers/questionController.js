const {Question} = require("../models/models");
const ApiError = require("../error/ApiError");

class QuestionController {
    async get(req, res, next) {
        const rows = await Question.findAll()
        return res.json({rows})
    }

    async saveOrCreate(req, res, next) {
        const {id, question_RU, question_EU, answer_RU, answer_EU} = req.body
        try {
            if (id) { // Edit
                const item = await Question.findByPk(id)
                item.set({
                    question_EU,
                    question_RU,
                    answer_EU,
                    answer_RU
                })
                await item.save()
                res.json({message: 'Вопрос обновлён!'})
            } else { // Create
                const newItem = await Question.create({
                    question_RU,
                    question_EU,
                    answer_RU,
                    answer_EU
                })
                res.json({message: 'Вопрос добавлен!', item: newItem})
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка...'))
        }
    }

    async delete(req, res, next) {
        const {id} = req.body
        try {
            const item = await Question.findByPk(id)
            await item.destroy()
            res.json({message: 'Вопрос удалён!'})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка...'))
        }
    }
}


module.exports = new QuestionController()