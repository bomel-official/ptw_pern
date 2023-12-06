import {Question} from "../models/models";
import ApiError from "../error/ApiError";

class FaqController {
    async getAll(req, res, next) {
        const rows = await Question.findAll()
        return res.json({rows})
    }

    async edit(req, res, next) {
        const {id, question_RU, question_EU, answer_RU, answer_EU} = req.body
        try {
            const question = await Question.findByPk(id)
            question.set({
                question_RU,
                question_EU,
                answer_RU,
                answer_EU
            })
            await question.save()
            return res.json({question})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }

    async create(req, res, next) {
        const {question_RU, question_EU, answer_RU, answer_EU} = req.body
        try {
            const question = await Question.set({
                question_RU,
                question_EU,
                answer_RU,
                answer_EU
            })
            return res.json({question})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }

    async delete(req, res, next) {
        const {id} = req.body
        try {
            const question = await Question.findByPk(id)
            await question.destroy()
            return res.json({message: 'Удалено!'})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }
}


module.exports = new FaqController()