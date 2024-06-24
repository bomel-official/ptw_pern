import { NextFunction, Request, Response } from "express";
import { genJwt } from "../libs";

export function check( req: Request, res: Response, next: NextFunction ) {
    const token = req.user ? genJwt( {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        nickname: req.user.nickname
    } ) : null;
    return res.json( { token } );
}
