const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const sharp = require("sharp");
const path = require("path");
const {User, Team} = require("../models/models");
const {Op} = require("sequelize");

const TEAMS_LIMIT = 5

class TournamentController {
    async saveOrCreate(req, res, next) {
        try {
            const {
                players: playersJSON,
                name: nameJSON,
                id: idJSON,
                capitanId: capitanIdJSON
            } = req.body
            const players = JSON.parse(playersJSON || "null")
            const name = JSON.parse(nameJSON || "null")
            const id = JSON.parse(idJSON || "null")
            const capitanId = JSON.parse(capitanIdJSON || "null")
            const {avatar} = req.files || {avatar: null}

            let filename = null
            if (avatar) {
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
            }
            const creator = await User.findOne({
                where: {
                    id: req.user.id
                },
                include: {
                    model: Team,
                    as: 'own_teams'
                }
            })
            if (name.length < 3) {
                return next(ApiError.badRequest('Название команды должно быть 3 и больше символов'))
            }
            for (let playerId of players) {
                if (!creator.friends.includes(parseInt(playerId)) && creator.id !== parseInt(playerId)) {
                    return next(ApiError.badRequest('Для добавления в команду игрок должен быть у вас в друзьях'))
                }
            }
            if (id) { // Edit
                const team = await Team.findOne({
                    where: {
                        id
                    },
                    include: {
                        model: User,
                        as: 'players'
                    },
                })
                if (req.user.id !== team.capitanId) {
                    return next(ApiError.badRequest('Вы не можете редактировать эту команду'))
                }
                for (let player of team.players) {
                    if (!players.includes(player)) {
                        await team.removePlayers(player)
                    }
                }
                const playersResponse = []
                for (let playerId of players) {
                    const player = await User.findByPk(playerId)
                    playersResponse.push(player)
                    if (team.players.filter((teamPlayer => (teamPlayer.id === playerId)))) {
                        await team.addPlayers(player)
                    }
                }
                team.name = name
                team.avatar = filename || team.avatar
                await team.save()
                const resTeam = {
                    id: team.id,
                    avatar: team.avatar,
                    name: team.name,
                    capitanId: team.capitanId,
                    players: playersResponse
                }
                return res.json({message: 'Команда обновлена', team: resTeam})
            } else { // Create
                if (req.user.id !== capitanId) {
                    return next(ApiError.badRequest('Ошибка, некорректный запрос'))
                }
                if (creator.own_teams.length >= TEAMS_LIMIT) {
                    return next(ApiError.badRequest('Вы не можете создать больше 5 команд'))
                }
                const slug = name.toString().toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, "")
                if (slug.length <= 3) {
                    return next(ApiError.badRequest('Название команды должно быть написано латиницей, без особых символов'))
                }
                const team = await Team.create({
                    name,
                    avatar: filename,
                    capitanId: creator.id,
                    slug
                })
                const playersResponse = []
                await creator.addOwn_teams(team)
                for (let playerId of players) {
                    const player = await User.findByPk(playerId)
                    playersResponse.push(player)
                    await team.addPlayers(player)
                }
                const resTeam = {
                    id: team.id,
                    avatar: team.avatar,
                    name: team.name,
                    capitanId: team.capitanId,
                    players: playersResponse
                }
                return res.json({message: 'Команда создана', team: resTeam})
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
        }
    }

    async search(req, res, next) {
        const {type, userId} = req.params
        let where = {}
        try {
            if (type && userId && type === 'capitan') {
                where = {
                    userId: userId
                }
            }
            if (type && userId && type === 'part') {
                where = {
                    [Op.contains]: userId
                }
            }
            const rows = await Team.findAll({
                where,
                include: [
                    {
                        model: User,
                        as: 'players'
                    },
                    {
                        model: User,
                        association: 'capitan'
                    },
                ]
            })
            res.json({rows})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }

    async deleteOrLeaveTeam(req, res, next) {
        const {teamId, userId} = req.body
        try {
            const team = await Team.findByPk(teamId)
            if (userId === team.capitanId) {
                await team.destroy()
                res.json({message: 'Команда успешно удалена!', isOk: true})
            } else {
                const user = await User.findByPk(userId)
                await team.removePlayers(user)
                res.json({message: 'Вы успешно покинули комаду!', isOk: true})
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }

}

module.exports = new TournamentController()