import {
    BuildAttachmentRepository,
    BuildAttachmentTypeRepository,
    BuildWeaponRepository,
    BuildWeaponTypeRepository
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { parseModelWhere } from "../libs";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const { object } = req.params;

    try {
        if ( object === "weapon-type" ) {
            const { rows: items } = await BuildWeaponTypeRepository.findAndCountAll(
                parseModelWhere( BuildWeaponTypeRepository, req ) );
            return res.json( { items } );
        } else if ( object === "weapon" ) {
            const { rows: items } = await BuildWeaponRepository.findAndCountAll(
                parseModelWhere( BuildWeaponRepository, req ) );
            return res.json( { items } );
        } else if ( object === "attachment" ) {
            const { rows: items } = await BuildAttachmentRepository.findAndCountAll(
                parseModelWhere( BuildAttachmentRepository, req ) );
            return res.json( { items } );
        } else if ( object === "attachment-list" ) {
            const { rows: items } = await BuildAttachmentTypeRepository.findAndCountAll( {
                order: [
                    [ { model: BuildAttachmentRepository, as: "buildAttachment" }, "title_RU", "ASC" ],
                    [ "title_RU", "ASC" ]
                ],
                include: {
                    model: BuildAttachmentRepository,
                }
            } );
            return res.json( { items } );
        } else if ( object === "attachment-type" ) {
            const { rows: items } = await BuildAttachmentTypeRepository.findAndCountAll(
                parseModelWhere( BuildAttachmentTypeRepository, req ) );
            return res.json( { items } );
        }
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }

    return res.json( { items: [] } );
}
