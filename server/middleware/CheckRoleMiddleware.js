const jwt = require("jsonwebtoken")
const {User} = require("../models/models");

module.exports = function (roles){
    return async function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(401).json({message: 'Не авторизован'})
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await User.findByPk(decoded.id)
            if (!roles.includes(user.role)) {
                return res.status(403).json({message: 'Нет доступа'})
            }
            req.user = user
            next()
        } catch (e) {
            res.status(401).json({message: 'Не авторизован'})
        }
    }
}


