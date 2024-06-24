import { yookassaCreateInvoice } from "@controllers";
import { CV, generateValidator, isError } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function getOnePayUrl( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            participantId: new CV( req.body.participantId,
                { label: "participantId" } ).number().val
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { participantId } = validated.data;

    const { invoice } = await yookassaCreateInvoice( participantId );
    if ( !invoice ) {
        return next(
            ApiError.badRequest( "Ошибка платёжной системы" ) );
    }
    return res.json( { url: invoice.url } );
}
