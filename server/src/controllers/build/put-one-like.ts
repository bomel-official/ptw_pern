import { Build } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function putOneLike( req: Request, res: Response,
                                  next: NextFunction ) {
    const { buildId } = req.query;
    if ( typeof buildId !== "string" ) {
        return next( ApiError.badRequest( "Сборка не найдена" ) );
    }

    const build = await Build.findByPk( buildId );
    if ( !build ) {
        return next( ApiError.badRequest( "Сборка не найдена" ) );
    }

    if ( !req.user || !req.user.id ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }

    const userId = req.user.id;
    if ( build.likes.includes( userId ) ) {
        const newLikes = build.likes.filter(
            ( item ) => item !== userId );
        build.set( {
            likes: newLikes,
            likesCount: newLikes.length
        } );
    } else {
        const newLikes = [ ...build.likes, userId ];
        build.set( {
            likes: newLikes,
            likesCount: newLikes.length
        } );
    }
    await build.save();

    return res.json( { message: "Успешно!", likes: build.likes } );
}
