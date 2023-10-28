const ApiError = require("../error/ApiError");
const {Tournament, Participant, PlayerResult} = require('../models/models')
const uuid = require("uuid");
const sharp = require("sharp");
const path = require("path");

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
}

module.exports = new TournamentController()