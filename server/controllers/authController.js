const ApiError = require("../error/ApiError");
const axios = require('axios')
const {User} = require("../models/models");
const genJwt = require("../funtions/genJwt");
const parseCookie = require("../funtions/parseCookie");

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
            const { id, username, avatar, email } = userResponse.data;
            const UserAlreadyExist = await User.findOne({where: {email}})
            if (UserAlreadyExist) {
                UserAlreadyExist.discord_id = id
                UserAlreadyExist.discord_avatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}`
                await UserAlreadyExist.save()

                const token = genJwt(UserAlreadyExist.id, UserAlreadyExist.email, UserAlreadyExist.role, UserAlreadyExist.nickname)

                res.cookie('token', token, {maxAge: 1000 * 60 * 15, httpOnly: true});
                return res.redirect(process.env.CLIENT_URL + `/profile/${UserAlreadyExist.nickname}`);
            } else {
                const newUser = await User.create({
                    email: email.trim(),
                    discord_id: id,
                    discord_avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}`
                })
                newUser.nickname = `${username}${newUser.id}`
                await newUser.save()

                const token = genJwt(newUser.id, newUser.email, newUser.role, newUser.nickname)

                res.cookie('token', token, {maxAge: 1000 * 60 * 15, httpOnly: true});
                return res.redirect(process.env.CLIENT_URL + `/profile/${newUser.nickname}`);
            }
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Некорректный запрос'))
        }
    }
    async getUserByCookie(req, res, next) {
        const cookies = parseCookie(req.headers.cookie)
        if (cookies.token) {
            res.clearCookie('token');
            return res.json({token: cookies.token})
        } else {
            return res.json({token: null})
        }
    }
}


module.exports = new AuthController()