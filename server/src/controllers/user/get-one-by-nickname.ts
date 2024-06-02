import { User } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getOneByNickname( req: Request, res: Response,
                                        next: NextFunction ) {
    const { nickname } = req.params;

    const user = await User.findOne( {
        where: { nickname }
    } );
    if ( !user ) {
        return res.json( { message: "Ничего не найдено" } );
    }

    return res.json( { data: user } );
}
