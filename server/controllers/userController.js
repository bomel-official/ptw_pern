const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {User, Cart, FriendRequest} = require('../models/models')
const {Op} = require("sequelize");
const uuid = require('uuid')
const sharp = require('sharp')
const path = require('path')
const genJwt = require("../funtions/genJwt");

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
        const {s, friendOf} = req.query
        try {
            let capitan = null
            if (friendOf) {
                capitan = await User.findByPk(friendOf)
            }
            const {count, rows} = await User.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {nickname: {
                                        [Op.iLike]: `%${s}%`
                                    }},
                                {activisionId: {
                                        [Op.iLike]: `%${s}%`
                                    }}
                            ]
                        },
                        capitan ? {
                            id: {
                                [Op.in]: capitan.friends
                            }
                        }: {}
                    ]
                },
                limit: 10
            })
            return res.json({
                message: `Пользователей найдено: ${count}`,
                rows
            })
        } catch (e) {
            return res.json({
                message: `Пользователей найдено: ${0}`,
                rows: []
            })
        }
    }
    async getOne (req, res, next) {
        const {id} = req.params
        let result = null
        try {
            result = await User.findByPk(id)
            if (!result) {
                return res.json({message: 'Ничего не найдено'})
            }
        } catch (e) {}
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

    async edit (req, res, next) {
        const {
            id,
            nickname,
            activisionId,
            discord,
            vk,
            youtube,
            steam,
            twitch,
            twitter,
            password,
            platform,
            oldPassword,
            device
        } = req.body

        const {avatar} = req.files || {avatar: null}
        const user = await User.findByPk(id)

        const nicknameCandidate = await User.findOne({
            where: { nickname: nickname.trim() },
            attributes: ['id']
        })
        if (nicknameCandidate && (nicknameCandidate?.id !== parseInt(id))) {
            return next(ApiError.badRequest('Пользователь с таким никнеймом уже существует'))
        }

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
        user.nickname = nickname ? nickname.trim() : user.nickname
        user.activisionId = activisionId ? activisionId : user.activisionId
        user.discord = discord ? discord : user.discord
        user.vk = vk ? vk : user.vk
        user.youtube = youtube ? youtube : user.youtube
        user.steam = steam ? steam : user.steam
        user.twitch = twitch ? twitch : user.twitch
        user.twitter = twitter ? twitter : user.twitter
        user.platform = platform ? platform : user.platform
        user.device = device ? device : user.device

        const hashPassword = password ? await bcrypt.hash(password, 5) : ''


        if (password) {
            if (oldPassword && bcrypt.compareSync(oldPassword, user.password)) {
                user.password = hashPassword
            } else {
                return res.json({
                    status: 'neg',
                    text: 'Старый пароль введён неверно'
                })
            }
        }

        await user.save()

        return res.json({
            message: 'Данные успешно обновлены!'
        })
    }

    async getAdmins(req, res, next) {
        const {count, rows} = await User.findAndCountAll({
            where: {
                role: 'ADMIN'
            }
        })
        res.json({rows})
    }
    async setRole(req, res, next) {
        const {userId, role} = req.body
        try {
            await User.update({role}, {
                where: {
                    id: userId,
                },
            });
            return res.json({message: 'Успех!'})
        } catch(e) {
            console.log(e)
            return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
        }
    }
}

module.exports = new UserController()