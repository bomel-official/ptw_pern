import { BuildAttachmentRepository, BuildAttachmentTypeRepository, BuildRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function getOneBuildAttachments( req: Request, res: Response, next: NextFunction ) {
    const { buildId } = req.query;
    if ( typeof buildId !== "string" ) {
        return next( ApiError.badRequest( "Сборка не найдена" ) );
    }

    const build = await BuildRepository.findByPk( buildId );
    if ( !build ) {
        return next( ApiError.badRequest( "Сборка не найдена" ) );
    }

    try {
        const { rows: items } = await BuildAttachmentRepository.findAndCountAll( {
            where: {
                id: { [Op.in]: build.attachments.map( att => att[0] ) }
            },
            include: BuildAttachmentTypeRepository
        } );
        return res.json( { items } );
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }
}
