const ApiError = require("../error/ApiError");
const {Tournament, Participant, PlayerResult, User, Team, Build, ParticipantUser, TournamentUser, Invoice} = require('../models/models')
const uuid = require("uuid");
const path = require("path");
const {Op, Sequelize} = require("sequelize");
const isUserAdmin = require("../funtions/isUserAdmin");
const {logger} = require("sequelize/lib/utils/logger");
const axios = require("axios");
const uploadImage = require("../funtions/uploadImage");

const AMOUNT_ROUNDS = 5

async function checkIsPaid(participantId) {
    const participant = await Participant.findByPk(participantId)
    const invoices = await Invoice.findAll({
        where: {
            participantId: participant.id
        }
    })

    for (const invoice of invoices) {
        const {data: enotInvoiceInfo} = await axios.get(`https://api.enot.io/invoice/info?order_id=${JSON.stringify(invoice.id)}&shop_id=${process.env.ENOT_SHOP_ID}&invoice_id=${invoice.enotId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json',
                'Accept': 'application/json',
                'x-api-key': process.env.ENOT_SECRET_KEY
            }
        })
        if (enotInvoiceInfo.data.status === 'success') {
            participant.isPaid = true
            await participant.save()

            return true
        }
    }
    return false
}

async function createInvoice(participantId) {
    const participant = await Participant.findByPk(participantId)
    const tournament = await Tournament.findByPk(participant.tournamentId)

    const newInvoice = await Invoice.create({
        amount: tournament.participationPrice
    })

    const {data: enotInvoice} = await axios.post('https://api.enot.io/invoice/create', {
        amount: tournament.participationPrice,
        order_id: 'test-' + JSON.stringify(newInvoice.id),
        currency: newInvoice.currency,
        shop_id: process.env.ENOT_SHOP_ID,
        hook_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
        comment: `Participation on ${tournament.title_EU}`,
        success_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
        fail_url: `${process.env.CLIENT_URL}/tournament/${tournament.slug}`,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json',
            'Accept': 'application/json',
            'x-api-key': process.env.ENOT_SECRET_KEY
        }
    })


    newInvoice.enotId = enotInvoice.data.id
    newInvoice.url = enotInvoice.data.url
    newInvoice.participantId = participant.id
    newInvoice.expired = enotInvoice.data.expired.replace(' ', 'T')
    participant.invoiceUrl = enotInvoice.data.url
    participant.invoiceId = newInvoice.id

    await participant.save()
    await newInvoice.save()

    return {invoice: newInvoice, participant}
}

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
            descAdditional_EU,
            slug
        } = req.body

        let filename = null
        try {
            filename = await uploadImage(previewImg)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest(e.message || 'Произошла ошибка, попробуйте позже'))
        }

        const slugTournament = await Tournament.findOne({
            where: { slug }
        })
        if (slugTournament) {
            return next(ApiError.badRequest('Турнир с такой ссылкой уже существует'))
        }

        const newTournament = await Tournament.create({
            title_RU,
            title_EU,
            slug: slug || title_EU.toString().toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
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
            descAdditional_EU,
            slug
        } = req.body

        let filename = null
        try {
            filename = await uploadImage(previewImg)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest(e.message || 'Произошла ошибка, попробуйте позже'))
        }

        const slugTournament = await Tournament.findOne({
            where: {
                [Op.and]: [
                    {
                        slug
                    },
                    {
                        id: {
                            [Op.not]: req.body.id
                        }
                    }
                ]
            }
        })
        if (slugTournament) {
            return next(ApiError.badRequest('Турнир с такой ссылкой уже существует'))
        }

        const tournament = await Tournament.findOne({
            where: { id: req.body.id }
        })

        tournament.set({
            title_RU,
            title_EU,
            slug: slug || title_EU.toString().toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
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
        let orderType = [
            ['dateBegin', 'DESC'],
            ['id', 'DESC'],
        ]
        if (status === 'active') {
            whereDateEndObject = {
                dateEnd: {
                    [Op.gte]: Sequelize.literal('NOW()'),
                },
            }
            orderType = [
                ['dateBegin', 'ASC'],
                ['id', 'DESC'],
            ]
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
            },
            order: orderType,
            include: [{
                model: User,
                as: 'players',
                attributes: ['id']
            }],
            limit: numberPosts === '-1' ? null : numberPosts
        })
        return res.json({
            tournaments: rows
        })
    }

    async getById (req, res, next) {
        const {slug} = req.params
        const tournament = await Tournament.findOne({
            where: {slug},
            include: [{
                model: User,
                as: 'players',
                attributes: ['id']
            }]
        })
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
        const {teamId, players, tournamentId, id} = req.body

        try {
            const tournament = await Tournament.findByPk(tournamentId)
            const team = await Team.findByPk(teamId)

            if (!tournament || !team || (team.capitanId !== req.user.id && !isUserAdmin(req.user))) {
                return next(ApiError.badRequest('Ошибка, некорректный запрос'))
            }
            if (players.length !== tournament.playersInTeam) {
                return next(ApiError.badRequest('Некорректное количество участников!'))
            }

            if (!id || isUserAdmin(req.user)) { // Create participant
                const alreadyRegisteredUser = await TournamentUser.findOne({
                    where: {
                        tournamentId: tournamentId,
                        userId: {
                            [Op.in]: players.map(player => (parseInt(player)))
                        }
                    }
                })
                if (alreadyRegisteredUser) {
                    const foundUser = await User.findByPk(alreadyRegisteredUser.userId)
                    return next(ApiError.badRequest(`${foundUser.nickname} - уже учавствует`))
                }

                // Calculate roomNumber
                const participants = await Participant.findAll({
                    where: {
                        tournamentId: tournamentId
                    },
                    fields: ['roomNumber', 'id'],
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

                let newReq = await Participant.create({
                    tournamentId,
                    points: 0,
                    players,
                    teamId,
                    isRoundHidden: Array(AMOUNT_ROUNDS).fill(false),
                    dataArray: Array(players.length).fill(Array(AMOUNT_ROUNDS).fill(0)),
                    places: Array(AMOUNT_ROUNDS).fill([-1, 0]),
                    roomNumber
                })
                for (const playerId of players) {
                    const player = await User.findByPk(playerId)
                    if (player) {
                        await newReq.addUser(player)
                        await tournament.addPlayers(player)
                    } else {
                        return next(ApiError.badRequest('Ошибка, некорректный запрос'))
                    }
                }

                if (tournament.participationPrice) {
                    newReq = (await createInvoice(newReq.id)).participant
                }
                res.json({isOk: true, message: 'Вы зарегистрировалиь на турнир!', url: newReq.invoiceUrl})
            } else { // Edit participant
                const alreadyRegisteredParticipant = await Participant.findOne({
                    where: {
                        id: {
                            [Op.ne]: id
                        }
                    },
                    include: [
                        {
                            model: User,
                            as: 'users',
                            where: {
                                id: {
                                    [Op.in]: players
                                }
                            }
                        }
                    ]
                })
                if (alreadyRegisteredParticipant && alreadyRegisteredParticipant.users[0]) {
                    return next(ApiError.badRequest(`${alreadyRegisteredParticipant.users[0].nickname} - уже учавствует в другой команде`))
                }
                const participant = await Participant.findOne({
                    where: {
                        id
                    },
                    include: {
                        model: User,
                        as: 'users'
                    }
                })
                participant.teamId = teamId
                await participant.save()
                const participantUsers = participant.users.map((user) => (user.id))

                const toAddUsers = []
                const toRemoveUsers = []

                for (const playerId of players) {
                    const player = await User.findByPk(playerId)
                    if (player && !participantUsers.includes(player.id)) {
                        toAddUsers.push(player)
                    }
                }
                participant.users.forEach(user => {
                    if (user && !players.includes(user.id)) {
                        toRemoveUsers.push(user)
                    }
                })
                for (const user of toRemoveUsers) {
                    await participant.removeUser(user)
                    await tournament.removePlayers(user)
                }
                for (const user of toAddUsers) {
                    await participant.addUser(user)
                    await tournament.addPlayers(user)
                }
            }

            res.json({isOk: true, message: 'Вы зарегистрировалиь на турнир!'})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка, некорректный запрос'))
        }
    }

    async getPayUrl(req, res, next) {
        const {participantId} = req.query

        try {
            const {invoice} = await createInvoice(participantId)
            return res.json({url: invoice.url})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка, некорректный запрос'))
        }
    }

    async getParticipantInvoiceInfo(req, res, next) {
        const {participantId} = req.query
        try {
            const isPaid = await checkIsPaid(participantId)
            res.json({isPaid})
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
                ['id', 'ASC'],
                [{ model: User, as: 'users' }, 'id', 'ASC'],
            ],
            include: [
                {model: User, as: 'users' },
                {model: Team}]
        })

        participants.map((participant => {
            let isSorted = true
            for (let i = 1; i < participant.users.length; i++) {
                if (participant.users[i].id < participant.users[i - 1].id) {
                    isSorted = false
                }
            }
            if (!isSorted) {
                console.log(`unsorted: ${participant.id}`)
                participant.users.sort((a, b) => (a.id - b.id))
            }
            return participant
        }))

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
                participant = await Participant.findOne({
                    where: {
                        tournamentId
                    },
                    include: [
                        {
                            model: User,
                            as: 'users',
                            where: {
                                id: req.user.id,
                            }
                        }
                    ]
                })
            }
            if (!participant) {
                return next(ApiError.forbidden('Ошибка сервера...'))
            }
            const participantUsers = await ParticipantUser.findAll({
                where: {
                    participantId: participant.id
                }
            })
            const participantPlayerIds = participantUsers.map(participantUser => (participantUser.userId))
            const tournament = await Tournament.findByPk(participant.tournamentId)
            console.log(isUserAdmin(req.user))
            if (!participantPlayerIds.includes(req.user.id) && !isUserAdmin(req.user)) {
                return next(ApiError.forbidden('Нет доступа'))
            }
            for (const user of participant.users) {
                tournament.removePlayers(user)
            }
            await participant.destroy()
            return res.json({isOk: true, message: 'Удалено!'})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка...'))
        }
    }

    async getOwnParticipant(req, res, next) {
        const {tournamentId, userId} = req.query
        if (!tournamentId || !userId) {
            return res.json({participant: null, participantUsers: []})
        }
        try {
            let participant = await Participant.findOne({
                where: {
                    tournamentId
                },
                include: [
                    {
                        model: User,
                        as: 'users',
                        where: {
                            id: userId,
                        }
                    },
                    {
                        model: Team,
                        as: 'team',
                        include: [
                            {
                                model: User,
                                as: 'players'
                            }
                        ]
                    },
                    {
                        model: Invoice
                    }
                ]
            })
            if (!participant) {
                return res.json({participant: null, participantUsers: []})
            }
            const tournament = await Tournament.findByPk(participant.tournamentId)

            if (tournament.participationPrice && !participant.isPaid) {
                const isPaid = await checkIsPaid(participant.id)
                if (isPaid) {
                    participant.isPaid = isPaid
                    await participant.save()
                }

                if (participant.invoice && participant.invoice.expired) {
                    const invoiceExpired = new Date(participant.invoice.expired).getTime()
                    const now = new Date().getTime()

                    if (invoiceExpired < now) {
                        participant = (await createInvoice(participant.id)).participant
                    }
                } else if (!participant.invoice) {
                    participant = (await createInvoice(participant.id)).participant
                }
            }

            const participantUsers = await ParticipantUser.findAll({
                where: {
                    participantId: participant.id
                }
            })
            return res.json({participant, participantUsers})
        } catch (e) {
            console.log(e)
            return res.json({participant: null, participantUsers: []})
        }
    }
}

module.exports = new TournamentController()