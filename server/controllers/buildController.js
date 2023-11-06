class BuildController {
    async create(req, res, next) {
        const {title_RU, title_EU} = req.body

        return res.json({message: 'Добавлено!'})
    }
}

module.exports = new BuildController()