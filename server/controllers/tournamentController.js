const ApiError = require("../error/ApiError");
const {Tournament, Participant, PlayerResult} = require('../models/models')

class TournamentController {
    async create (req, res, next) {
        const {email, password, activisionId, discord} = req.body

        return res.json({message: 'Ok!'})
    }
}

module.exports = new TournamentController()