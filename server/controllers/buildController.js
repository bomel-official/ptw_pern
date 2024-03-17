const {BuildWeaponType, BuildWeapon, BuildAttachment, BuildAttachmentType, Build, User} = require("../models/models");
const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const path = require("path");
const {Op} = require("sequelize");
const uploadImage = require("../funtions/uploadImage");

const getWhere = (WhereClass, req) => {
    return {
        where: {
            [Op.and]: Object.entries(req.query).map(([key, value]) =>
                (((value !== 'null' && key in WhereClass.rawAttributes) && !(key === 'gameVersion' && value === 'wz'))
                        ? {[key]: value}
                        : {}
                )
            )
        },
        order: [
            ['title_RU', 'ASC']
        ]
    }
}

class BuildController {
    async create(req, res, next) {
        const {object} = req.params

        try {
            if (object === 'weapon-type') {
                const {title_RU, title_EU} = req.body
                const newItem = await BuildWeaponType.create({
                    title_EU,
                    title_RU
                })
                return res.json({message: 'Добавлено!', item: newItem})
            } else if (object === 'weapon') {
                const {title_RU, title_EU, buildWeaponTypeId, gameVersion, allowedAttachments} = req.body
                const {image} = req.files || {image: null}
                let filename = ''

                try {
                    filename = await uploadImage(image, 352, 180)
                } catch (e) {
                    console.log(e)
                    return next(ApiError.badRequest(e.message || 'Произошла ошибка, попробуйте позже'))
                }

                const newItem = await BuildWeapon.create({
                    title_EU,
                    title_RU,
                    buildWeaponTypeId,
                    image: filename,
                    gameVersion,
                    allowedAttachments: JSON.parse(allowedAttachments)
                })
                return res.json({message: 'Добавлено!', item: newItem})
            } else if (object === 'attachment') {
                const {title_RU, title_EU, gameVersion, buildAttachmentTypeId} = req.body
                const {image} = req.files || {image: null}

                let filename = ''
                try {
                    filename = await uploadImage(image, 352, 180)
                } catch (e) {
                    console.log(e)
                    return next(ApiError.badRequest(e.message || 'Произошла ошибка, попробуйте позже'))
                }

                const newItem = await BuildAttachment.create({
                    title_EU,
                    title_RU,
                    gameVersion,
                    buildAttachmentTypeId,
                    image: filename
                })
                return res.json({message: 'Добавлено!', item: newItem})
            } else if (object === 'attachment-type') {
                const {title_RU, title_EU} = req.body
                const newItem = await BuildAttachmentType.create({
                    title_EU,
                    title_RU
                })
                return res.json({message: 'Добавлено!', item: newItem})
            }
        } catch (e) {
            return next(ApiError.badRequest('Неверно заполены данные'))
        }

        return res.json({message: 'Ошибка...'})
    }

    async edit(req, res, next) {
        const {object} = req.params

        try {
            if (object === 'weapon-type') {
                const {id, title_RU, title_EU} = req.body
                const item = await BuildWeaponType.findByPk(id)

                item.set({
                    title_EU,
                    title_RU
                })
                await item.save()

                return res.json({message: 'Обновлено!', item})
            } else if (object === 'weapon') {
                const {id, title_RU, title_EU, buildWeaponTypeId, gameVersion, allowedAttachments} = req.body
                const {image} = req.files || {image: null}
                let filename = ''
                const item = await BuildWeapon.findByPk(id)

                try {
                    filename = await uploadImage(image, 352, 180)
                } catch (e) {
                    console.log(e)
                    return next(ApiError.badRequest(e.message || 'Произошла ошибка, попробуйте позже'))
                }

                item.set({
                    title_EU,
                    title_RU,
                    buildWeaponTypeId,
                    image: filename || item.image,
                    gameVersion,
                    allowedAttachments: JSON.parse(allowedAttachments)
                })
                await item.save()
                return res.json({message: 'Обновлено!', item})
            } else if (object === 'attachment') {
                const {id, title_RU, title_EU, gameVersion, buildAttachmentTypeId} = req.body
                const {image} = req.files || {image: null}
                let filename = ''
                const item = await BuildAttachment.findByPk(id)

                try {
                    filename = await uploadImage(image, 352, 180)
                    console.log('uploaded: ' + filename)
                } catch (e) {
                    console.log(e)
                    return next(ApiError.badRequest(e.message || 'Произошла ошибка, попробуйте позже'))
                }

                item.set({
                    title_EU,
                    title_RU,
                    gameVersion,
                    buildAttachmentTypeId,
                    image: filename || item.image
                })

                await item.save()
                return res.json({message: 'Обновлено!', item})
            } else if (object === 'attachment-type') {
                const {id, title_RU, title_EU} = req.body
                const item = await BuildAttachmentType.findByPk(id)

                item.set({
                    title_EU,
                    title_RU
                })
                await item.save()
                return res.json({message: 'Обновлено!', item})
            }
        } catch (e) {
            return next(ApiError.badRequest('Неверно заполены данные'))
        }

        return res.json({message: 'Ошибка...'})
    }

    async getAll(req, res, next) {
        const {object} = req.params

        try {
            if (object === 'weapon-type') {
                const {rows: items} = await BuildWeaponType.findAndCountAll(getWhere(BuildWeaponType, req))
                return res.json({items})
            } else if (object === 'weapon') {
                const {rows: items} = await BuildWeapon.findAndCountAll(getWhere(BuildWeapon, req))
                return res.json({items})
            } else if (object === 'attachment') {
                const {rows: items} = await BuildAttachment.findAndCountAll(getWhere(BuildAttachment, req))
                return res.json({items})
            } else if (object === 'attachment-list') {
                const {rows: items} = await BuildAttachmentType.findAndCountAll({
                    order: [
                        [{ model: BuildAttachment}, 'title_RU', 'ASC'],
                        ['title_RU', 'ASC']
                    ],
                    include: {
                        model: BuildAttachment,
                    }
                })
                return res.json({items})
            } else if (object === 'attachment-type') {
                const {rows: items} = await BuildAttachmentType.findAndCountAll(getWhere(BuildAttachmentType, req))
                return res.json({items})
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }

        return res.json({items: []})
    }

    async getOne(req, res, next) {
        const {object} = req.params

        try {
            if (object === 'weapon-type') {
                const item = await BuildWeaponType.findOne(getWhere(BuildWeaponType, req))
                return res.json({item})
            } else if (object === 'weapon') {
                const item = await BuildWeapon.findOne(getWhere(BuildWeapon, req))
                return res.json({item})
            } else if (object === 'attachment') {
                const item = await BuildAttachment.findOne(getWhere(BuildAttachment, req))
                return res.json({item})
            } else if (object === 'attachment-type') {
                const item = await BuildAttachmentType.findOne(getWhere(BuildAttachmentType, req))
                return res.json({item})
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }

        return res.json({items: []})
    }

    async delete(req, res, next) {
        const {object} = req.params
        const {itemId} = req.body

        if (object === 'weapon-type') {
            await BuildWeaponType.destroy({where: {id: itemId}})
            return res.json({message: 'Удалено!'})
        } else if (object === 'weapon') {
            await BuildWeapon.destroy({where: {id: itemId}})
            return res.json({message: 'Удалено!'})
        } else if (object === 'attachment') {
            await BuildAttachment.destroy({where: {id: itemId}})
            return res.json({message: 'Удалено!'})
        } else if (object === 'attachment-type') {
            await BuildAttachmentType.destroy({where: {id: itemId}})
            return res.json({message: 'Удалено!'})
        }

        return res.json({message: 'Ошибка...'})
    }

    async buildCreate(req, res, next) {
        const {gameVersion, weaponTypeId, weaponId, attachments, title} = req.body
        const parsedAttachments = JSON.parse(attachments)

        if (title.length < 3) {
            return next(ApiError.badRequest('Название должно быть длиннее 3 символов'))
        }

        try {
            const newItem = await Build.create({
                title,
                userId: req.user.id,
                gameVersion,
                buildWeaponId: weaponId,
                buildWeaponTypeId: weaponTypeId,
                attachments: parsedAttachments.map(att => ([att.attachment, att.attachmentType, att.range[0], att.range[1]]))
            })
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Поля заполнены некорректно...'))
        }


        return res.json({message: 'Сборка успешно создана!'})
    }

    async buildDelete(req, res, next) {
        const {buildId} = req.body
        try {
            const build = await Build.findByPk(buildId)
            if (build.userId !== req.user.id && req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN") {
                return next(ApiError.forbidden('Нет доступа'))
            }
            await build.destroy()
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка...'))
        }

        return res.json({message: 'Сборка успешно удалена!'})
    }

    async buildSearch(req, res, next) {
        const {s, userId, weaponTypeId, weaponId, buildType} = req.query

        let userQuery = {}
        if (buildType === 'admin') {
            userQuery = {
                ...userQuery,
                [Op.or]: [
                    {
                        '$user.role$': 'SUPERADMIN'
                    },
                    {
                        '$user.role$': 'ADMIN'
                    }
                ]
            }
        }
        if (userId) {
            userQuery = {
                ...userQuery,
                userId
            }
        }

        try {
            const {rows: items} = await Build.findAndCountAll({
                where: {
                    [Op.and]: [
                        s ? {
                            [Op.or]: [
                                {
                                    '$user.nickname$': {
                                        [Op.substring]: s
                                    }
                                },
                                {
                                    '$build_weapon.title_RU$': {
                                        [Op.substring]: s
                                    }
                                },
                                {
                                    '$build_weapon.title_EU$': {
                                        [Op.substring]: s
                                    }
                                }
                            ]
                        }: true,
                        userQuery,
                        weaponTypeId ? {
                            buildWeaponTypeId: weaponTypeId
                        } : true,
                        weaponId ? {
                            buildWeaponId: weaponId
                        } : true,

                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'user'
                    },
                    {
                        model: BuildWeapon,
                        as: 'build_weapon'
                    },
                    {
                        model: BuildWeaponType,
                        as: 'build_weapon_type'
                    }
                ],
                limit: 15,
                order: [
                    ['likesCount', 'DESC'],
                    ['title', 'ASC']
                ]
            })
            return res.json({items})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }

    async buildAttachmentGetAllIncluded(req, res, next) {
        const {buildId} = req.query
        const build = await Build.findByPk(buildId)
        try {
            const {rows: items} = await BuildAttachment.findAndCountAll({
                where: {
                    id: {[Op.in]: build.attachments.map(att => att[0])}
                },
                include: BuildAttachmentType
            })
            return res.json({items})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }

    async like(req, res, next) {
        const {buildId} = req.body
        const build = await Build.findByPk(buildId)

        try {
            if (build) {
                const userIdInt = parseInt(req.user.id)
                if (build.likes.includes(userIdInt)) {
                    const newLikes = build.likes.filter((item) => item !== userIdInt)
                    build.set({
                        likes: newLikes,
                        likesCount: newLikes.length
                    })
                } else {
                    const newLikes = [...build.likes, userIdInt]
                    build.set({
                        likes: newLikes,
                        likesCount: newLikes.length
                    })
                }
                await build.save()
                return res.json({message: 'Успешно!', likes: build.likes})
            }
        } catch (e) {
            console.log(e)
        }
        return next(ApiError.badRequest('Некорректный запрос'))
    }
}

module.exports = new BuildController()