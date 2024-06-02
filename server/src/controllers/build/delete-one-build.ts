import { Build } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function deleteOneBuild( req: Request, res: Response,
                                      next: NextFunction ) {
    const { buildId } = req.body;
    const build = await Build.findByPk( buildId );

    if ( !build ) {
        return next( ApiError.badRequest( "Сборка не найдена" ) );
    }

    if ( !req.user ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }

    if ( build.userId !== req.user.id && req.user.role !== "ADMIN" &&
        req.user.role !== "SUPERADMIN" ) {
        return next( ApiError.forbidden( "Нет доступа" ) );
    }

    await build.destroy();

    return res.json( { message: "Сборка успешно удалена!" } );
}
