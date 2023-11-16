const ApiError = require("../error/ApiError");
const axios = require('axios')

class AuthController {
    async discord(req, res, next) {
        const url = 'https://discord.com/api/oauth2/authorize?client_id=1128760670603710535&redirect_uri=http%3A%2F%2Flocalhost%3A7000%2Fapi%2Fauth%2Fdiscord-redirect&response_type=code&scope=identify%20guilds%20email'
        res.redirect(url)
    }
    async discordRedirect(req, res, next) {
        if (!req.query.code) {
            return next(ApiError.badRequest('Некорректный запрос'))
        }
        const {code} = req.query
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.CLIENT_REDIRECT
        })
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/x-www-form-urlencoded'
        }
        const auth = {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET
        }
        try {
            const response = await axios.post(
                'https://discord.com/api/oauth2/token',
                params,
                {headers, auth}
            )
            const userResponse = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`,
                    ...headers
                }
            })
            const { id, username, avatar } = userResponse.data;
            return res.json({data: userResponse.data})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }
}


module.exports = new AuthController()