import { NextFunction, Request, Response } from "express";
import { parseCookie } from "../libs";

export async function getUserByCookie( req: Request, res: Response,
                                         next: NextFunction ) {
    const cookies = parseCookie( req.headers.cookie );
    if ( cookies.token ) {
        res.clearCookie( "token" );
        return res.json( { token: cookies.token } );
    } else {
        return res.json( { token: null } );
    }
}
