import { Tournament } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { uploadImage } from "../libs";

export async function putOne( req: Request, res: Response,
                              next: NextFunction ) {
    const previewImg = req.files?.previewImg;
    const {
        title_RU,
        title_EU,
        game,
        type,
        isRegisterOn,
        twitchChannel,
        dateBegin,
        dateEnd,
        maxUsers,
        playersInTeam,
        participationPrice,
        prizes,
        prize_1,
        prize_2,
        prize_3,
        format_RU,
        format_EU,
        descRules_RU,
        descRules_EU,
        descAdditional_RU,
        descAdditional_EU,
        slug
    } = req.body;

    const filename = await uploadImage( previewImg );
    const newSlug = slug ||
        title_EU.toString().toLowerCase().trim().replace( / /g, "-" )
            .replace( /[^\w-]+/g, "" );

    const slugTournament = await Tournament.findOne( {
        where: {
            [Op.and]: [
                {
                    slug: newSlug,
                },
                {
                    id: {
                        [Op.not]: req.body.id
                    }
                }
            ]
        }
    } );
    if ( slugTournament ) {
        return next(
            ApiError.badRequest( "Турнир с такой ссылкой уже существует" ) );
    }

    const tournament = await Tournament.findOne( {
        where: { id: req.body.id }
    } );
    if ( !tournament ) {
        return next(
            ApiError.badRequest( "Турнир не найден" ) );
    }

    tournament.set( {
        title_RU,
        title_EU,
        slug: newSlug,
        game,
        type,
        isRegisterOn,
        twitchChannel,
        dateBegin,
        dateEnd,
        maxUsers,
        playersInTeam,
        participationPrice,
        prizes,
        prize_1,
        prize_2,
        prize_3,
        format_RU,
        format_EU,
        descRules_RU,
        descRules_EU,
        descAdditional_RU,
        descAdditional_EU
    } );
    if ( filename ) {
        tournament.set( {
            previewImg: filename
        } );
    }

    await tournament.save();

    return res.json( { message: "Турнир обновлён!" } );
}
