const {BuildWeaponType, BuildWeapon, BuildAttachment, BuildAttachmentType, Build, User} = require("../models/models");
const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const sharp = require("sharp");
const path = require("path");
const {Op} = require("sequelize");

const getWhere = (WhereClass, req) => {
    return {
        where: {
            [Op.and]: Object.entries(req.query).map(([key, value]) =>
                (((value !== 'null' && key in WhereClass.rawAttributes) && !(key === 'gameVersion' && value === 'wz'))
                        ? {[key]: value}
                        : {}
                )
            )
        }
    }
}

class BuildController {
    async create(req, res, next) {
        const {object} = req.params

        if (object === 'weapon-type') {
            const {title_RU, title_EU} = req.body
            const newItem = await BuildWeaponType.create({
                title_EU,
                title_RU
            })
            return res.json({message: 'Добавлено!', item: newItem})
        } else if (object === 'weapon') {
            const {title_RU, title_EU, buildWeaponTypeId, gameVersion} = req.body
            const {image} = req.files || {avatar: null}
            let filename = ''

            if (image) {
                try {
                    filename = uuid.v4() + '.jpg'
                    const allowedFiletypes = ['image/jpeg', 'image/png']
                    if (!allowedFiletypes.find(type => type === image.mimetype)) {
                        return next(ApiError.badRequest('Недопустимый формат изображения, загружайте PNG и JPG файлы'))
                    }
                    await sharp(image.data).resize({
                        width: 176,
                        height: 90,
                        fit: 'cover',
                        background: {r: 255, g: 255, b: 255, alpha: 1}
                    }).toFormat('jpeg').toFile(path.resolve(__dirname, '..', 'static', filename))
                } catch (e) {
                    console.log(e)
                    return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
                }
            }
            const newItem = await BuildWeapon.create({
                title_EU,
                title_RU,
                buildWeaponTypeId,
                image: filename,
                gameVersion
            })
            return res.json({message: 'Добавлено!', item: newItem})
        } else if (object === 'attachment') {
            const {title_RU, title_EU, isNumerable, gameVersion, buildAttachmentTypeId, allowedWeapons} = req.body
            const newItem = await BuildAttachment.create({
                title_EU,
                title_RU,
                isNumerable,
                gameVersion,
                buildAttachmentTypeId,
                allowedWeapons: JSON.parse(allowedWeapons)
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

        return res.json({message: 'Ошибка...'})
    }

    async edit(req, res, next) {
        const {object} = req.params

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
            const {id, title_RU, title_EU, buildWeaponTypeId, gameVersion} = req.body
            const {image} = req.files || {avatar: null}
            let filename = ''

            const item = await BuildWeapon.findByPk(id)

            if (image) {
                try {
                    filename = uuid.v4() + '.jpg'
                    const allowedFiletypes = ['image/jpeg', 'image/png']
                    if (!allowedFiletypes.find(type => type === image.mimetype)) {
                        return next(ApiError.badRequest('Недопустимый формат изображения, загружайте PNG и JPG файлы'))
                    }
                    await sharp(image.data).resize({
                        width: 176,
                        height: 90,
                        fit: 'cover',
                        background: {r: 255, g: 255, b: 255, alpha: 1}
                    }).toFormat('jpeg').toFile(path.resolve(__dirname, '..', 'static', filename))
                } catch (e) {
                    console.log(e)
                    return next(ApiError.internal('Произошла ошибка, попробуйте позже'))
                }
            }
            item.set({
                title_EU,
                title_RU,
                buildWeaponTypeId,
                image: filename,
                gameVersion
            })
            await item.save()
            return res.json({message: 'Обновлено!', item})
        } else if (object === 'attachment') {
            const {id, title_RU, title_EU, isNumerable, gameVersion, buildAttachmentTypeId, allowedWeapons} = req.body
            const item = await BuildAttachment.findByPk(id)

            item.set({
                title_EU,
                title_RU,
                isNumerable,
                gameVersion,
                buildAttachmentTypeId,
                allowedWeapons: JSON.parse(allowedWeapons)
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
            } else if (object === 'attachment-type') {
                const {rows: items} = await BuildAttachmentType.findAndCountAll(getWhere(BuildAttachmentType, req))
                return res.json({items})
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Некорректный запрос'))
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
            return next(ApiError.internal('Некорректный запрос'))
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
        const {gameVersion, weaponTypeId, weaponId, attachments} = req.body
        const parsedAttachments = JSON.parse(attachments)
        try {
            const newItem = await Build.create({
                userId: req.user.id,
                gameVersion,
                buildWeaponId: weaponId,
                buildWeaponTypeId: weaponTypeId,
                attachments: parsedAttachments.map(att => ([att.attachment, att.attachmentType, att.range[0], att.range[1]]))
            })
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Поля заполнены некорректно...'))
        }


        return res.json({message: 'Сборка успешно создана!'})
    }

    async buildDelete(req, res, next) {
        const {buildId} = req.body
        try {
            const build = await Build.findByPk(buildId)
            if (build.userId !== req.user.id) {
                return next(ApiError.internal('Нет доступа'))
            }
            await build.destroy()
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Ошибка...'))
        }

        return res.json({message: 'Сборка успешно удалена!'})
    }

    async buildSearch(req, res, next) {
        const {s, userId} = req.query
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
                        userId ? {
                            userId
                        } : true
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
                    ['id', 'DESC']
                ]
            })
            return res.json({items})
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Некорректный запрос'))
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
            return next(ApiError.internal('Некорректный запрос'))
        }
    }
}

module.exports = new BuildController()