import {
    BuildAttachment,
    BuildAttachmentType,
    BuildWeapon,
    BuildWeaponType
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { parseModelWhere } from "../libs";

export async function getOne( req: Request, res: Response,
                              next: NextFunction ) {
    const { object } = req.params;

    try {
        if ( object === "weapon-type" ) {
            const item = await BuildWeaponType.findOne(
                parseModelWhere( BuildWeaponType, req ) );
            return res.json( { item } );
        } else if ( object === "weapon" ) {
            const item = await BuildWeapon.findOne(
                parseModelWhere( BuildWeapon, req ) );
            return res.json( { item } );
        } else if ( object === "attachment" ) {
            const item = await BuildAttachment.findOne(
                parseModelWhere( BuildAttachment, req ) );
            return res.json( { item } );
        } else if ( object === "attachment-type" ) {
            const item = await BuildAttachmentType.findOne(
                parseModelWhere( BuildAttachmentType, req ) );
            return res.json( { item } );
        }
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }

    return res.json( { items: [] } );
}
