const ApiError = require("../error/ApiError");
const {Tournament, Participant, PlayerResult, User} = require('../models/models')
const uuid = require("uuid");
const sharp = require("sharp");
const path = require("path");
const {Op, Sequelize} = require("sequelize");

class TournamentController {
    async create (req, res, next) {
        const {previewImg} = req.files
        const {
            title_RU,
            title_EU,
            game,
            type,
            isRegisterOn,
            twitchChannel,
            dateBegin,
            dateEnd,
            maxUsers,
            playersInTeam,
            participationPrice,
            prizes,
            prize_1,
            prize_2,
            prize_3,
            format_RU,
            format_EU,
            descRules_RU,
            descRules_EU,
            descAdditional_RU,
            descAdditional_EU
        } = req.body

        let filename = null
        if (previewImg) {
            try {
                filename = uuid.v4() + '.jpg'
                const allowedFiletypes = ['image/jpeg', 'image/png']
                if (!allowedFiletypes.find(type => type === previewImg.mimetype)) {
                    return next(ApiError.badRequest('Недопустимый формат изображения, загружайте PNG и JPG файлы'))
                }
                await sharp(previewImg.data).resize({
                    width: 436,
                    height: 294,
                    fit: 'cover',
                    background: {r: 255, g: 255, b: 255, alpha: 1}
                }).toFormat('jpeg').toFile(path.resolve(__dirname, '..', 'static', filename))
            } catch (e) {
                console.log(e)
                return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
            }
        }

        const newTournament = await Tournament.create({
            title_RU,
            title_EU,
            slug: title_EU.toString().toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
            game,
            type,
            previewImg: filename,
            isRegisterOn,
            twitchChannel,
            dateBegin,
            dateEnd,
            maxUsers,
            playersInTeam,
            participationPrice,
            prizes,
            prize_1,
            prize_2,
            prize_3,
            format_RU,
            format_EU,
            descRules_RU,
            descRules_EU,
            descAdditional_RU,
            descAdditional_EU
        })

        return res.json({message: 'Турнир создан!'})
    }

    async edit (req, res, next) {
        const previewImg = req.files?.previewImg
        const {
            title_RU,
            title_EU,
            game,
            type,
            isRegisterOn,
            twitchChannel,
            dateBegin,
            dateEnd,
            maxUsers,
            playersInTeam,
            participationPrice,
            prizes,
            prize_1,
            prize_2,
            prize_3,
            format_RU,
            format_EU,
            descRules_RU,
            descRules_EU,
            descAdditional_RU,
            descAdditional_EU
        } = req.body

        let filename = null
        if (previewImg) {
            try {
                filename = uuid.v4() + '.jpg'
                const allowedFiletypes = ['image/jpeg', 'image/png']
                if (!allowedFiletypes.find(type => type === previewImg.mimetype)) {
                    return next(ApiError.badRequest('Недопустимый формат изображения, загружайте PNG и JPG файлы'))
                }
                await sharp(previewImg.data).resize({
                    width: 436,
                    height: 294,
                    fit: 'cover',
                    background: {r: 255, g: 255, b: 255, alpha: 1}
                }).toFormat('jpeg').toFile(path.resolve(__dirname, '..', 'static', filename))
            } catch (e) {
                console.log(e)
                return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
            }
        }

        const tournament = await Tournament.findOne({
            where: { id: req.body.id }
        })

        tournament.set({
            title_RU,
            title_EU,
            slug: title_EU.toString().toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
            game,
            type,
            isRegisterOn,
            twitchChannel,
            dateBegin,
            dateEnd,
            maxUsers,
            playersInTeam,
            participationPrice,
            prizes,
            prize_1,
            prize_2,
            prize_3,
            format_RU,
            format_EU,
            descRules_RU,
            descRules_EU,
            descAdditional_RU,
            descAdditional_EU
        })
        if (filename) {
            tournament.set({
                previewImg: filename
            })
        }

        await tournament.save()

        return res.json({message: 'Турнир обновлён!'})
    }

    async getAll (req, res, next) {
        const {status, numberPosts, game, type} = req.query
        let whereDateEndObject = {}
        if (status === 'active') {
            whereDateEndObject = {
                dateEnd: {
                    [Op.gte]: Sequelize.literal('NOW()'),
                },
            }
        } else if (status === 'finished') {
            whereDateEndObject = {
                dateEnd: {
                    [Op.lte]: Sequelize.literal('NOW()'),
                },
            }
        }
        const rows = await Tournament.findAll({
            where: {
                [Op.and]: [
                    whereDateEndObject,
                    {
                        game: game
                    },
                    type ? {
                        type: type
                    } : {}
                ]
            } ,
            limit: numberPosts === '-1' ? null : numberPosts
        })
        return res.json({
            tournaments: rows
        })
    }

    async getById (req, res, next) {
        const {slug} = req.params
        const tournament = await Tournament.findOne({ where: {slug}})
        return res.json({
            tournament
        })
    }
}

module.exports = new TournamentController()