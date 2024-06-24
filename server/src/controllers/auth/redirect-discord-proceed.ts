import { UserRepository } from "@core";
import { getEnv, jwtUserData } from "@libs";
import { DiscordUserResponse, Oauth2TokenResponse } from "@types";
import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { genJwt } from "../libs";

export async function redirectDiscordProceed( req: Request, res: Response, next: NextFunction ) {
    const { code } = req.query;
    if ( !code || typeof code !== "string" ) {
        return res.redirect( getEnv( process.env.CLIENT_URL ) + `/auth/` );
    }

    const params = new URLSearchParams( {
        grant_type: "authorization_code",
        code,
        redirect_uri: getEnv( process.env.CLIENT_REDIRECT )
    } );
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/x-www-form-urlencoded"
    };
    const auth = {
        username: getEnv( process.env.CLIENT_ID ),
        password: getEnv( process.env.CLIENT_SECRET )
    };

    try {
        const response = await axios.post(
            "https://discord.com/api/oauth2/token", params, {
                headers, auth
            } ) as Oauth2TokenResponse;

        const userResponse = await axios.get(
            "https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${ response.data.access_token }`, ...headers
                }
            } );
        const { id, username, avatar, email } = userResponse.data as DiscordUserResponse;
        const UserAlreadyExist = await UserRepository.findOne( {
            where: {
                [Op.or]: [ {
                    email
                }, {
                    discord_id: id
                } ]
            }
        } );
        if ( UserAlreadyExist ) {
            UserAlreadyExist.discord_id = id;
            UserAlreadyExist.discord_username = username;
            UserAlreadyExist.discord_avatar = `https://cdn.discordapp.com/avatars/${ id }/${ avatar }`;
            await UserAlreadyExist.save();

            const token = genJwt( jwtUserData( UserAlreadyExist ) );

            res.cookie( "token", token, {
                maxAge: 1000 * 60 * 15, httpOnly: true
            } );
            return res.redirect( getEnv( process.env.CLIENT_URL ) + `/profile/${ UserAlreadyExist.nickname }` );
        } else {
            let counter = 0;
            let UsernameTaken = await UserRepository.findOne(
                { where: { nickname: username } } );
            while ( UsernameTaken ) {
                counter += 1;
                UsernameTaken = await UserRepository.findOne( { where: { nickname: `${ username }${ counter }` } } );
            }

            const newUser = await UserRepository.create( {
                email: email ? email.trim() : id,
                discord_id: id,
                discord_avatar: `https://cdn.discordapp.com/avatars/${ id }/${ avatar }`,
                discord_username: username,
                nickname: `${ username }${ counter ? counter : "" }`
            } );

            const token = genJwt( jwtUserData( newUser ) );

            res.cookie( "token", token, {
                maxAge: 1000 * 60 * 15, httpOnly: true
            } );
            return res.redirect( getEnv( process.env.CLIENT_URL ) + `/profile/${ newUser.nickname }` );
        }
    } catch ( e ) {
        console.log( e );
        return res.redirect( getEnv( process.env.CLIENT_URL ) + `/auth/` );
    }
}
