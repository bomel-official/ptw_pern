import { JWTUserData, UserRepository } from "@core";
import { ApiError } from "@error";
import { getJwtSecret } from "@libs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genJwt } from "../../controllers/libs";

export const authService = {
    /** Password login by nickname or email. Returns a signed JWT. */
    async login( email: string, password: string ): Promise<string> {
        const attributes = [ "email", "password", "id", "role", "nickname" ];
        const nicknameUser = await UserRepository.findOne( { where: { nickname: email }, attributes } );
        const emailUser = await UserRepository.findOne( { where: { email }, attributes } );

        const user = nicknameUser || emailUser;
        if ( !user ) {
            throw ApiError.badRequest( "Пользователь не найден" );
        }
        if ( !bcrypt.compareSync( password, user.password ) ) {
            throw ApiError.badRequest( "Неверный пароль" );
        }
        return genJwt( { id: user.id, email: user.email, role: user.role, nickname: user.nickname } );
    },

    /** Verifies the supplied token and issues a fresh one for the same user. */
    async renew( reqToken: string ): Promise<string> {
        let userId: number;
        try {
            userId = (jwt.verify( reqToken, getJwtSecret() ) as JWTUserData).id;
        } catch {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        const user = await UserRepository.findByPk( userId );
        if ( !user ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        return genJwt( { id: user.id, email: user.email, role: user.role, nickname: user.nickname } );
    },
};
