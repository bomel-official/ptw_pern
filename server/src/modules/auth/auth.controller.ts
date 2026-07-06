import { UserRepository } from "@core";
import { ApiError } from "@error";
import { getEnv, jwtUserData } from "@libs";
import { asyncHandler } from "@shared";
import { DiscordUserResponse, Oauth2TokenResponse } from "@app-types";
import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { genJwt, parseCookie } from "../../controllers/libs";
import { authService } from "./auth.service";

export const authController = {
    redirectDiscord( req: Request, res: Response ) {
        res.redirect( getEnv( process.env.DISCORD_AUTH_URL ) );
    },

    async redirectDiscordProceed( req: Request, res: Response, next: NextFunction ) {
        const { code } = req.query;
        if ( !code || typeof code !== "string" ) {
            return res.redirect( getEnv( process.env.CLIENT_URL ) + `/auth/` );
        }

        const params = new URLSearchParams( {
            grant_type: "authorization_code",
            code,
            redirect_uri: getEnv( process.env.CLIENT_REDIRECT ),
        } );
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "application/x-www-form-urlencoded",
        };
        const auth = {
            username: getEnv( process.env.CLIENT_ID ),
            password: getEnv( process.env.CLIENT_SECRET ),
        };

        try {
            const response = await axios.post(
                "https://discord.com/api/oauth2/token", params, { headers, auth },
            ) as Oauth2TokenResponse;

            const userResponse = await axios.get( "https://discord.com/api/users/@me", {
                headers: { Authorization: `Bearer ${ response.data.access_token }`, ...headers },
            } );
            const { id, username, avatar, email } = userResponse.data as DiscordUserResponse;

            const cookieOptions = {
                maxAge: 1000 * 60 * 15,
                httpOnly: true,
                sameSite: "lax" as const,
                secure: process.env.NODE_ENV === "production",
            };

            const existing = await UserRepository.findOne( {
                where: { [Op.or]: [ { email }, { discord_id: id } ] },
            } );
            if ( existing ) {
                existing.discord_id = id;
                existing.discord_username = username;
                existing.discord_avatar = `https://cdn.discordapp.com/avatars/${ id }/${ avatar }`;
                await existing.save();

                res.cookie( "token", genJwt( jwtUserData( existing ) ), cookieOptions );
                return res.redirect( getEnv( process.env.CLIENT_URL ) + `/profile/${ existing.nickname }` );
            }

            let counter = 0;
            let usernameTaken = await UserRepository.findOne( { where: { nickname: username } } );
            while ( usernameTaken ) {
                counter += 1;
                usernameTaken = await UserRepository.findOne( { where: { nickname: `${ username }${ counter }` } } );
            }

            const newUser = await UserRepository.create( {
                email: email ? email.trim() : id,
                discord_id: id,
                discord_avatar: `https://cdn.discordapp.com/avatars/${ id }/${ avatar }`,
                discord_username: username,
                nickname: `${ username }${ counter ? counter : "" }`,
            } );

            res.cookie( "token", genJwt( jwtUserData( newUser ) ), cookieOptions );
            return res.redirect( getEnv( process.env.CLIENT_URL ) + `/profile/${ newUser.nickname }` );
        } catch ( e ) {
            return res.redirect( getEnv( process.env.CLIENT_URL ) + `/auth/` );
        }
    },

    getUserByCookie( req: Request, res: Response ) {
        const cookies = parseCookie( req.headers.cookie );
        if ( cookies.token ) {
            res.clearCookie( "token" );
            return res.json( { token: cookies.token } );
        }
        return res.json( { token: null } );
    },

    check( req: Request, res: Response ) {
        const token = req.user
            ? genJwt( {
                id: req.user.id, email: req.user.email, role: req.user.role, nickname: req.user.nickname,
            } )
            : null;
        return res.json( { token } );
    },

    login: asyncHandler( async ( req, res ) => {
        const token = await authService.login( req.body.email, req.body.password );
        return res.json( { token } );
    } ),

    renew: asyncHandler( async ( req, res ) => {
        if ( !req.headers.authorization ) {
            throw ApiError.badRequest( "Нет заголовка авторизации в запросе" );
        }
        const reqToken = req.headers.authorization.split( " " )[1];
        if ( !reqToken ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        const token = await authService.renew( reqToken );
        return res.json( { token } );
    } ),
};
