import { UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getManyAdmins( req: Request, res: Response, next: NextFunction ) {
    const { rows } = await UserRepository.findAndCountAll( {
        where: {
            role: "ADMIN"
        }
    } );
    res.json( { rows } );
}
