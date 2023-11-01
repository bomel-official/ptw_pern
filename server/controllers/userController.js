const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {User, Cart, FriendRequest} = require('../models/models')
const {Op} = require("sequelize");
const uuid = require('uuid')
const sharp = require('sharp')
const path = require('path')


function genJwt (id, email, role, nickname) {
    return jwt.sign(
        {id, email, role, nickname},
        process.env.JWT_SECRET_KEY,
        {expiresIn: '7d'}
    )
}

class UserController {
    async register (req, res, next) {
        const {email, password, repeatPassword, nickname} = req.body
        if (!nickname) {
            return next(ApiError.badRequest('Поле никнейм не заполнено'))
        }
        if (password.length < 4) {
            return next(ApiError.badRequest('Длина пароля меньше 4 символов'))
        }
        if (nickname.length < 4) {
            return next(ApiError.badRequest('Длина никнейма меньше 4 символов'))
        }
        if (!nickname.match(/^[0-9A-Z]{4,}$/i)) {
            return next(ApiError.badRequest('Поле никнейм имеет недопустимые символы'))
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
            return next(ApiError.badRequest('Некоректный email'))
        }

        const emailCandidate = await User.findOne({
            where: { email: email.trim() },
            attributes: ['id']
        })
        if (emailCandidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const nicknameCandidate = await User.findOne({
            where: { nickname: nickname.trim() },
            attributes: ['id']
        })
        if (nicknameCandidate) {
            return next(ApiError.badRequest('Пользователь с таким никнеймом уже существует'))
        }

        if (password !== repeatPassword) {
            return next(ApiError.badRequest('Пароли не совпадают'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const newUser = await User.create({
            email: email.trim(),
            password: hashPassword,
            nickname: nickname.trim()
        })
        const newCart = await Cart.create({userId: newUser.id})
        newUser.cartId = newCart.id
        await newUser.save()
        const token = genJwt(newUser.id, newUser.email, newUser.role, newUser.nickname)

        return res.json({token})
    }

    async login (req, res, next) {
        const {email, password} = req.body
        const nicknameUser = await User.findOne({
            where: { nickname: email },
            attributes: ['email', 'password', 'id', 'role', 'nickname']
        })
        const emailUser = await User.findOne({
            where: { email },
            attributes: ['email', 'password', 'id', 'role', 'nickname']
        })

        const user = nicknameUser || emailUser
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }

        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Неверный пароль'))
        }

        const token = genJwt(user.id, user.email, user.role, user.nickname)
        return res.json({token})
    }

    check (req, res, next) {
        const token = genJwt(req.user.id, req.user.email, req.user.role, req.user.nickname)
        return res.json({token})
    }

    async renew (req, res, next) {
        const reqToken = req.headers.authorization.split(' ')[1]
        if (!reqToken) {
            return res.status(401).json({message: 'Не авторизован'})
        }
        const userId = jwt.verify(reqToken, process.env.JWT_SECRET_KEY).id
        const user = await User.findByPk(userId)
        const token = genJwt(user.id, user.email, user.role, user.nickname)

        return res.json({token})
    }

    async search (req, res, next) {
        const {s} = req.query
        const {count, rows} = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    {nickname: {
                        [Op.like]: `%${s}%`
                    }},
                    {activisionId: {
                        [Op.like]: `%${s}%`
                    }}
                ]
            },
            limit: 10
        })
        return res.json({
            message: `Пользователей найдено: ${count}`,
            rows
        })
    }
    async getOne (req, res, next) {
        const {id} = req.params
        let result
        try {
            result = await User.findByPk(id)
            if (!result) {
                return res.json({message: 'Ничего не найдено'})
            }
        } catch (e) {
            result = null
        }
        return res.json({data: result})
    }
    async getOneByNickname (req, res, next) {
        const {nickname} = req.params
        const user = await User.findOne({
            where: { nickname }
        })
        if (!user) {
            return res.json({message: 'Ничего не найдено'})
        }
        return res.json({data: user})
    }

    async addFriend(req, res, next) {
        const {to} = req.body
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Не авторизован'})
        }
        const from = jwt.verify(token, process.env.JWT_SECRET_KEY).id

        const toUser = await User.findByPk(to)
        const fromUser = await User.findByPk(from)

        if (toUser.friends?.includes(from) && fromUser.friends?.includes(to)) {
            return res.json({message: 'Пользователь итак является вашим другом'})
        }

        const prevRequest = await FriendRequest.findOne({
            where: { userToId: to, userFromId: from }
        })
        if (prevRequest) {
            return res.json({message: 'Заявка отправлена!'})
        }

        const oppositeRequest = await FriendRequest.findOne({
            where: { userToId: from, userFromId: to }
        })
        if (oppositeRequest) {
            oppositeRequest.isAccepted = true
            let message = 'Пользователь добавлен в друзья!'
            await Promise.all([
                new Promise((resolve) => {
                    if (toUser.friends?.length) {
                        toUser.friends.push(from)
                    } else {
                        toUser.friends = [from]
                    }
                    toUser.save().then(resolve)
                }),
                new Promise((resolve) => {
                    if (fromUser.friends?.length) {
                        fromUser.friends.push(to)
                    } else {
                        fromUser.friends = [to]
                    }
                    fromUser.save().then(resolve)
                }),
                new Promise((resolve) => {
                    oppositeRequest.save().then(resolve)
                })
            ]).catch(() => {
                message = 'Что-то пошло не так...'
            })
            return res.json({message})
        } else {
            const newRequest = await FriendRequest.create({
                userToId: to,
                userFromId: from,
                isAccepted: false
            })
            return res.json({message: 'Заявка отправлена!'})
        }

    }

    async removeFriend(req, res, next) {
        const {to} = req.body
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Не авторизован'})
        }
        const from = jwt.verify(token, process.env.JWT_SECRET_KEY).id

        const toUser = await User.findByPk(to)
        const fromUser = await User.findByPk(from)

        let message = 'Пользователь успешно удалён из друзей'
        await Promise.all([
            new Promise((resolve) => {
                if (toUser.friends?.length) {
                    toUser.friends.filter((friendId) => friendId !== from)
                    toUser.save().then(resolve)
                } else {
                    resolve()
                }
            }),
            new Promise((resolve) => {
                if (fromUser.friends?.length) {
                    fromUser.friends.filter((friendId) => friendId !== to)
                    fromUser.save().then(resolve)
                } else {
                    resolve()
                }
            }),
            async () => {
                const request = await FriendRequest.findOne({
                    where: {
                        [Op.or]: [
                            {
                                userFromId: from,
                                userToId: to
                            },
                            {
                                userFromId: to,
                                userToId: from
                            },
                        ]
                    }
                })
                await request.destroy()
            }
        ]).catch(() => {
            message = 'Что-то пошло не так...'
        })
        return res.json({message})
    }

    async getFriends(req, res, next) {
        const {id} = req.params

        const user = await User.findByPk(id)
        const {count, rows: friends} = await User.findAndCountAll({
            where: {
                id: user.friends || []
            }
        })
        return res.json({
            message: `Друзей найдено: ${count}`,
            friends
        })
    }

    async edit (req, res, next) {
        const user = await User.findByPk(req.user.id)
        const {nickname, activisionId, discord, vk, youtube, steam, twitch} = req.body
        const {avatar} = req.files
        if (avatar) {
            try {
                const filename = uuid.v4() + '.jpg'
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
                user.avatar = filename
            } catch (e) {
                console.log(e)
                return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
            }
        }
        user.nickname = nickname ? nickname : user.nickname
        user.activisionId = activisionId ? activisionId : user.activisionId
        user.discord = discord ? discord : user.discord
        user.vk = vk ? vk : user.vk
        user.youtube = youtube ? youtube : user.youtube
        user.steam = steam ? steam : user.steam
        user.twitch = twitch ? twitch : user.twitch
        return res.json({
            message: 'Пользователь успешно обновлён!',
            data: {user}
        })
    }
}

module.exports = new UserController()