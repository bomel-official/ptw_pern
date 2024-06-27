import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { Error } from "sequelize";

export function errorHandlingMiddleware( err: Error | ApiError, req: Request, res: Response, next: NextFunction ) {
    if ( res.headersSent ) {
        return next( err );
    }
    if ( err instanceof ApiError ) {
        return res.status( err.status ).json( { message: err.message } );
    }
    return res.status( 500 ).json( { message: "Непредвиденная ошибка сервера!" } );
}
