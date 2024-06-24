import { UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getOne( req: Request, res: Response, next: NextFunction ) {
    const { id } = req.params;

    const result = await UserRepository.findByPk( id );
    if ( !result ) {
        return res.json( { message: "Ничего не найдено" } );
    }

    return res.json( { data: result } );
}
