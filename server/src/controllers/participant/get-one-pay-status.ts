import { yookassaGetStatus } from "@controllers";
import { CV, generateValidator, isError } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getOnePayStatus( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            participantId: new CV( req.body.participantId,
                { label: "participantId" } ).number().val
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { participantId } = validated.data;

    const isPaid = await yookassaGetStatus( participantId );
    res.json( { isPaid } );
}
