const ApiError = require("../error/ApiError");
const axios = require('axios')
const {User} = require("../models/models");
const genJwt = require("../funtions/genJwt");
const parseCookie = require("../funtions/parseCookie");
const {Op} = require("sequelize");

class AuthController {
    async discord(req, res, next) {
        const url = process.env.DISCORD_AUTH_URL
        res.redirect(url)
    }
    async discordRedirect(req, res, next) {
        if (!req.query.code) {
            return res.redirect(process.env.CLIENT_URL + `/auth/`);
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
            const UserAlreadyExist = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email
                        },
                        {
                            discord_id: id
                        }
                    ]
                }
            })
            if (UserAlreadyExist) {
                UserAlreadyExist.discord_id = id
                UserAlreadyExist.discord_username = username
                UserAlreadyExist.discord_avatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}`
                await UserAlreadyExist.save()

                const token = genJwt(UserAlreadyExist.id, UserAlreadyExist.email, UserAlreadyExist.role, UserAlreadyExist.nickname)

                res.cookie('token', token, {maxAge: 1000 * 60 * 15, httpOnly: true});
                return res.redirect(process.env.CLIENT_URL + `/profile/${UserAlreadyExist.nickname}`);
            } else {
                let counter = 0
                let UsernameTaken = await User.findOne({where: {nickname: username}})
                while (UsernameTaken) {
                    counter += 1
                    UsernameTaken = await User.findOne({where: {nickname: `${username}${counter}`}})
                }
                const newUser = await User.create({
                    email: email ? email.trim() : id,
                    discord_id: id,
                    discord_avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
                    discord_username: username,
                    nickname: `${username}${counter ? counter : ''}`
                })

                const token = genJwt(newUser.id, newUser.email, newUser.role, newUser.nickname)

                res.cookie('token', token, {maxAge: 1000 * 60 * 15, httpOnly: true});
                return res.redirect(process.env.CLIENT_URL + `/profile/${newUser.nickname}`);
            }
        } catch (e) {
            console.log(e)
            return res.redirect(process.env.CLIENT_URL + `/auth/`);
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