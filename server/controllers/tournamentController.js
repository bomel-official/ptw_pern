const ApiError = require("../error/ApiError");
const {Tournament, Participant, PlayerResult, User, Team} = require('../models/models')
const uuid = require("uuid");
const sharp = require("sharp");
const path = require("path");
const {Op, Sequelize} = require("sequelize");

const AMOUNT_ROUNDS = 5

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

    async register (req, res, next) {
        const {avatar} = req.files || {avatar: null}
        const {capitan, teamId, players: playersJson, name, id, tournamentId, teamPlayers: teamPlayersJSON, teamCapitan} = req.body
        const players = JSON.parse(playersJson)
        const teamPlayers = JSON.parse(teamPlayersJSON)

        let filename = null
        if (avatar) {
            try {
                filename = uuid.v4() + '.jpg'
                const allowedFiletypes = ['image/jpeg', 'image/png']
                if (!allowedFiletypes.find(type => type === avatar.mimetype)) {
                    return next(ApiError.badRequest('Недопустимый формат изображения, загружайте PNG и JPG файлы'))
                }
                await sharp(avatar.data).resize({
                    width: 120,
                    height: 120,
                    fit: 'cover',
                    background: {r: 255, g: 255, b: 255, alpha: 1}
                }).toFormat('jpeg').toFile(path.resolve(__dirname, '..', 'static', filename))
            } catch (e) {
                console.log(e)
                return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
            }
        }
        const tournament = await Tournament.findByPk(tournamentId)
        if (!tournament || !teamCapitan || !capitan || teamCapitan !== capitan || req.user.id !== parseInt(teamCapitan)) {
            return next(ApiError.badRequest('Ошибка, некорректный запрос'))
        }
        if (!players || players.length !== tournament.playersInTeam) {
            return next(ApiError.badRequest('Некорректное количество участников'))
        }
        if (name.length < 3) {
            return next(ApiError.badRequest('Название команды должно быть 3 и больше символов'))
        }
        for (let playerId of players) {
            if (tournament.participantsList.includes(parseInt(playerId))) {
                const usedUser = await User.findByPk(playerId)
                return next(ApiError.badRequest(`${usedUser.nickname} - уже учавствует`))
            }
        }

        const newReq = await Participant.create({
            tournamentId,
            points: 0,
            players,
            isRoundHidden: Array(AMOUNT_ROUNDS).fill(false),
            dataArray: Array(players.length).fill(Array(AMOUNT_ROUNDS).fill(0)),
            places: Array(AMOUNT_ROUNDS).fill(-1),
            avatar: filename
        })
        try {
            players.forEach(playerId => {
                User.findByPk(playerId).then((player => {
                    if (player) {
                        newReq.addUser(player)
                    } else {
                        return next(ApiError.badRequest('Ошибка, некорректный запрос'))
                    }
                }))
            })
        } catch (e) {
            return next(ApiError.badRequest('Ошибка, некорректный запрос'))
        }
        tournament.set({participantsList: [...tournament.participantsList, ...players]})
        await tournament.save()

        res.json({isOk: true, message: 'Вы зарегистрировалиь на турнир!'})
    }

    async getParticipants(req, res, next) {
        const {tournamentId} = req.query
        if (!tournamentId) {
            return res.json({participants: []})
        }
        const participants = await Participant.findAll({
            where: {
                tournamentId: tournamentId
            },
            order: [
                ['points', 'DESC'],
                ['id', 'DESC'],
            ],
            include: [{model: User}]
        })

        return res.json({participants})
    }
}

module.exports = new TournamentController()