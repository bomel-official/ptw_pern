const ApiError = require("../error/ApiError");
const {Tournament, Participant, PlayerResult, User, Team, Build} = require('../models/models')
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

    async redeclareRoom (req, res, next) {
        const {participantId} = req.body
        try {
            const participant = await Participant.findByPk(participantId)
            // Calculate roomNumber
            const participants = await Participant.findAll({
                where: {
                    tournamentId: participant.tournamentId
                },
                order: [
                    ['roomNumber', 'ASC'],
                    ['id', 'ASC'],
                ],
            })
            let roomNumber = 1
            for (const currentParticipant of participants) {
                if (currentParticipant.roomNumber === roomNumber && currentParticipant.id !== participant.id) {
                    roomNumber += 1
                }
            }
            participant.roomNumber = roomNumber
            await participant.save()

            return res.json({isOk: true})
        } catch (e) {
            return res.json({isOk: false})
        }
    }

    async register (req, res, next) {
        const {teamId, players, tournamentId} = req.body

        try {
            const tournament = await Tournament.findByPk(tournamentId)
            const team = await Team.findByPk(teamId)

            if (!tournament || !team || team.capitanId !== req.user.id) {
                return next(ApiError.badRequest('Ошибка, некорректный запрос'))
            }
            if (players.length !== tournament.playersInTeam) {
                return next(ApiError.badRequest('Некорректное количество участников!'))
            }

            for (let playerId of players) {
                if (tournament.participantsList.includes(parseInt(playerId))) {
                    const usedUser = await User.findByPk(playerId)
                    return next(ApiError.badRequest(`${usedUser.nickname} - уже учавствует`))
                }
            }

            // Calculate roomNumber
            const participants = await Participant.findAll({
                where: {
                    tournamentId: tournamentId
                },
                order: [
                    ['roomNumber', 'ASC'],
                    ['id', 'ASC'],
                ],
            })
            let roomNumber = 1
            for (const currentParticipant of participants) {
                if (currentParticipant.roomNumber === roomNumber) {
                    roomNumber += 1
                }
            }

            const newReq = await Participant.create({
                tournamentId,
                points: 0,
                players,
                teamId,
                isRoundHidden: Array(AMOUNT_ROUNDS).fill(false),
                dataArray: Array(players.length).fill(Array(AMOUNT_ROUNDS).fill(0)),
                places: Array(AMOUNT_ROUNDS).fill([-1, 0]),
                roomNumber
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
            await tournament.set({participantsList: [...tournament.participantsList, ...players]})
            await tournament.save()

            res.json({isOk: true, message: 'Вы зарегистрировалиь на турнир!'})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка, некорректный запрос'))
        }
    }

    async getParticipants(req, res, next) {
        const {tournamentId, type} = req.query
        if (!tournamentId) {
            return res.json({participants: []})
        }
        const participants = await Participant.findAll({
            where: {
                tournamentId: tournamentId
            },
            order: (!type || type === 'users') ? [
                ['roomNumber', 'ASC'],
                ['id', 'ASC'],
                [{ model: User, as: 'users' }, 'id', 'ASC'],
            ] : [
                ['points', 'DESC'],
                [{ model: User, as: 'users' }, 'id', 'ASC'],
                ['id', 'ASC'],
            ],
            include: [
                {model: User, as: 'users' },
                {model: Team}]
        })

        return res.json({participants})
    }

    async editRegister(req, res, next) {
        const {participants} = req.body
        try {
            const requestPromises = []
            for (let participant of participants) {
                requestPromises.push(new Promise((resolve, reject) => {
                    let points = 0
                    for (let i = 0; i < AMOUNT_ROUNDS; i++) {
                        points += participant.places[i][1]
                        if (!(participant.isRoundsHidden.length && participant.isRoundsHidden[i])) {
                            for (let j = 0; j < participant.players; j++) {
                                points += participant.dataArray[j][i]
                            }
                        }
                    }
                    Participant.findByPk(participant.id).then(item => {
                        item.dataArray = participant.dataArray
                        item.places = participant.places
                        item.isRoundsHidden = participant.isRoundsHidden
                        item.points = points
                        item.save().then(resolve)
                    })
                }))
            }
            await Promise.all(requestPromises).catch(e => {
                return res.json({isOk: false, message: e.message})
            })
            return res.json({isOk: true, message: 'Данные обновлены!'})
        } catch (e) {
            return res.json({isOk: false, message: e.message})
        }
    }

    async unregister(req, res, next) {
        const {participantId, tournamentId} = req.body

        try {
            let participant = null
            if (participantId) {
                participant = await Participant.findOne({
                    where: {
                        id: participantId
                    },
                    include: [{model: User}]
                })
            } else {
                const allParticipants = await Participant.findAll({
                    where: {
                        [Op.and]: [
                            {
                                tournamentId
                            }
                        ]
                    },
                    include: [{model: User, as: 'users'}]
                })
                for (let ptsp of allParticipants) {
                    if (ptsp.users.filter((user) => (user.id === req.user.id)).length) {
                        participant = ptsp
                    }
                }
            }
            const participantPlayerIds = participant.users.map(user => (user.id))
            const tournament = await Tournament.findByPk(participant.tournamentId)
            if (!participant || !participantPlayerIds.includes(req.user.id) && req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN") {
                return next(ApiError.forbidden('Нет доступа'))
            }
            await participant.destroy()
            tournament.set({
                participantsList: tournament.participantsList.filter((userId => (!participantPlayerIds.includes(userId))))
            })
            await tournament.save()
            return res.json({isOk: true, message: 'Удалено!'})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка...'))
        }
    }
}

module.exports = new TournamentController()