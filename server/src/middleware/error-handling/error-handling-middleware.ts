import {ApiError} from "@error";
import {Error} from "sequelize";
import {Response, Request} from "express";

export function errorHandlingMiddleware (err: Error | ApiError, req: Request, res: Response) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: 'Непредвиденная ошибка сервера!'})
}
