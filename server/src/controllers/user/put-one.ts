import { UserRepository } from "@core";
import { ApiError } from "@error";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { uploadImage } from "../libs";

export async function putOne( req: Request, res: Response,
                              next: NextFunction ) {
    const {
        id,
        nickname,
        activisionId,
        vk,
        youtube,
        steam,
        twitch,
        twitter,
        password,
        platform,
        oldPassword,
        device
    } = req.body;
    const { avatar } = req.files || { avatar: null };

    const user = await UserRepository.findByPk( id );
    if ( !user ) {
        return next( ApiError.badRequest( "Пользователь не найден" ) );
    }

    const nicknameCandidate = await UserRepository.findOne( {
        where: { nickname: nickname.trim() },
        attributes: [ "id" ]
    } );
    if ( nicknameCandidate && (nicknameCandidate?.id !== parseInt( id )) ) {
        return next( ApiError.badRequest( "Пользователь с таким никнеймом уже существует" ) );
    }

    user.avatar = await uploadImage( avatar, { width: 240, height: 240 } );
    user.nickname = nickname ? nickname.trim() : user.nickname;
    user.activisionId = activisionId ? activisionId : user.activisionId;
    user.vk = vk ? vk : user.vk;
    user.youtube = youtube ? youtube.replace( "https://www.youtube.com/", "" ) :
        user.youtube;
    user.steam = steam ? steam : user.steam;
    user.twitch =
        twitch ? twitch.replace( "https://www.twitch.tv/", "" ) : user.twitch;
    user.twitter =
        twitter ? twitter.replace( "https://twitter.com/", "" ) : user.twitter;
    user.platform = platform ? platform : user.platform;
    user.device = device ? device : user.device;

    if ( password ) {
        const hashPassword = password ? await bcrypt.hash( password, 5 ) : "";
        if ( oldPassword && bcrypt.compareSync( oldPassword, user.password ) ) {
            user.password = hashPassword;
        } else {
            return res.json( {
                status: "neg",
                text: "Старый пароль введён неверно"
            } );
        }
    }

    await user.save();

    return res.json( {
        message: "Данные успешно обновлены!"
    } );
}
