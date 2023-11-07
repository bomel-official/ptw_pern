const {BuildWeaponType, BuildWeapon, BuildAttachment, BuildAttachmentType, BuildMode} = require("../models/models");
const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const sharp = require("sharp");
const path = require("path");

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
            const {title_RU, title_EU, buildWeaponTypeId} = req.body
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
                image: filename
            })
            return res.json({message: 'Добавлено!', item: newItem})
        } else if (object === 'attachment') {
            const {title_RU, title_EU, isNumerable} = req.body
            const newItem = await BuildAttachment.create({
                title_EU,
                title_RU,
                isNumerable
            })
            return res.json({message: 'Добавлено!', item: newItem})
        } else if (object === 'attachment-type') {
            const {title_RU, title_EU} = req.body
            const newItem = await BuildAttachmentType.create({
                title_EU,
                title_RU
            })
            return res.json({message: 'Добавлено!', item: newItem})
        } else if (object === 'mode') {
            const {title_RU, title_EU} = req.body
            const newItem = await BuildMode.create({
                title_EU,
                title_RU
            })
            return res.json({message: 'Добавлено!', item: newItem})
        }

        return res.json({message: 'Ошибка...'})
    }
    async getAll(req, res, next) {
        const {object} = req.params

        if (object === 'weapon-type') {
            const {rows: items} = await BuildWeaponType.findAndCountAll({})
            return res.json({items})
        } else if (object === 'weapon') {
            const {rows: items} = await BuildWeapon.findAndCountAll({})
            return res.json({items})
        } else if (object === 'attachment') {
            const {rows: items} = await BuildAttachment.findAndCountAll({})
            return res.json({items})
        } else if (object === 'attachment-type') {
            const {rows: items} = await BuildAttachmentType.findAndCountAll({})
            return res.json({items})
        } else if (object === 'mode') {
            const {rows: items} = await BuildMode.findAndCountAll({})
            return res.json({items})
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
        } else if (object === 'mode') {
            await BuildMode.destroy({where: {id: itemId}})
            return res.json({message: 'Удалено!'})
        }

        return res.json({message: 'Ошибка...'})
    }
}

module.exports = new BuildController()