const jwt = require("jsonwebtoken");
const {User, FriendRequest} = require("../models/models");
const {Op} = require("sequelize");


class FriendsController {
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
                    toUser.friends = toUser.friends.filter((friendId) => friendId !== from)
                    toUser.save().then(resolve)
                } else {
                    resolve()
                }
            }),
            new Promise((resolve) => {
                if (fromUser.friends?.length) {
                    fromUser.friends = fromUser.friends.filter((friendId) => friendId !== to)
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

    async getFriendRequests(req, res, next) {
        const {id} = req.params

        const {count, rows: requests} = await FriendRequest.findAndCountAll({
            where: {
                [Op.and]: [
                    {
                        userToId: id
                    },
                    {
                        isAccepted: false
                    },
                ]
            },
            include: { model: User, as: 'user_from' }
        })
        return res.json({
            message: `Заявок найдено: ${count}`,
            requests
        })
    }
}


module.exports = new FriendsController()