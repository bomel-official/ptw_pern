const jwt = require("jsonwebtoken");
const {User, FriendRequest} = require("../models/models");
const {Op, Sequelize} = require("sequelize");

function areFriends(user1, user2) {
    return user1.friends?.includes(user2.id) && user2.friends?.includes(user1.id);
}

class FriendsController {
    async addFriend(req, res, next) {
        try {
            const { to } = req.body;
            const from = req.user.id;

            const recipient = await User.findByPk(to);
            const sender = await User.findByPk(from);

            if (areFriends(recipient, sender)) {
                return res.json({ message: 'Пользователь является вашим другом' });
            }

            const existingRequest = await FriendRequest.findOne({
                where: { userToId: to, userFromId: from }
            });

            if (existingRequest) {
                return res.json({ message: 'Заявка отправлена!' });
            }

            const oppositeRequest = await FriendRequest.findOne({
                where: { userToId: from, userFromId: to }
            });

            if (oppositeRequest) {
                await recipient.update({friends: [...recipient.friends, sender.id]});
                await sender.update({friends: [...sender.friends, recipient.id]});
                await oppositeRequest.update({isAccepted: true});
                return res.json({ message: 'Пользователь добавлен в друзья!' });
            } else {
                await FriendRequest.create({
                    userToId: to,
                    userFromId: from,
                    isAccepted: false
                });
                return res.json({ message: 'Заявка отправлена!' });
            }
        } catch (error) {
            console.error(error);
            return res.json({ message: 'Что-то пошло не так...' });
        }
    }

    async removeFriend(req, res, next) {
        try {
            const { to } = req.body;
            const from = req.user.id;

            const toUser = await User.findByPk(to);
            const fromUser = await User.findByPk(from);

            await Promise.all([
                toUser.friends?.length && toUser.update({ friends: toUser.friends.filter((friendId) => friendId !== from) }),
                fromUser.friends?.length && fromUser.update({ friends: fromUser.friends.filter((friendId) => friendId !== to) }),
                FriendRequest.destroy({
                    where: {
                        [Op.or]: [
                            { userFromId: from, userToId: to },
                            { userFromId: to, userToId: from },
                        ],
                    },
                }),
            ]);

            return res.json({ message: 'Пользователь успешно удалён из друзей' });
        } catch (error) {
            console.error(error);
            return res.json({ message: 'Что-то пошло не так...' });
        }
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