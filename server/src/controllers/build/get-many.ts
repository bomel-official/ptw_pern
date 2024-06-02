import {
    BuildAttachment,
    BuildAttachmentType,
    BuildWeapon,
    BuildWeaponType
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { parseModelWhere } from "../libs";

export async function getMany( req: Request, res: Response,
                               next: NextFunction ) {
    const { object } = req.params;

    try {
        if ( object === "weapon-type" ) {
            const { rows: items } = await BuildWeaponType.findAndCountAll(
                parseModelWhere( BuildWeaponType, req ) );
            return res.json( { items } );
        } else if ( object === "weapon" ) {
            const { rows: items } = await BuildWeapon.findAndCountAll(
                parseModelWhere( BuildWeapon, req ) );
            return res.json( { items } );
        } else if ( object === "attachment" ) {
            const { rows: items } = await BuildAttachment.findAndCountAll(
                parseModelWhere( BuildAttachment, req ) );
            return res.json( { items } );
        } else if ( object === "attachment-list" ) {
            const { rows: items } = await BuildAttachmentType.findAndCountAll( {
                order: [
                    [ { model: BuildAttachment, as: 'buildAttachment' }, "title_RU", "ASC" ],
                    [ "title_RU", "ASC" ]
                ],
                include: {
                    model: BuildAttachment,
                }
            } );
            return res.json( { items } );
        } else if ( object === "attachment-type" ) {
            const { rows: items } = await BuildAttachmentType.findAndCountAll(
                parseModelWhere( BuildAttachmentType, req ) );
            return res.json( { items } );
        }
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }

    return res.json( { items: [] } );
}
