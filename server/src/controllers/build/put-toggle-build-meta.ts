import { BuildRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function putToggleBuildMeta( req: Request, res: Response, next: NextFunction ) {
    const { buildId } = req.body;

    const build = await BuildRepository.findByPk( buildId );
    if ( !build ) {
        return next( ApiError.badRequest( "Сборка не найдена" ) );
    }

    build.isMeta = !build.isMeta;
    await build.save();

    return res.json( { isMeta: build.isMeta } );
}
