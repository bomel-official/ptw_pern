const jwt = require("jsonwebtoken");
const genJwt = function (id, email, role, nickname) {
    return jwt.sign(
        {id, email, role, nickname},
        process.env.JWT_SECRET_KEY,
        {expiresIn: '7d'}
    )
}

module.exports = genJwt