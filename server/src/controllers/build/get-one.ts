import {
    BuildAttachmentRepository,
    BuildAttachmentTypeRepository,
    BuildWeaponRepository,
    BuildWeaponTypeRepository
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { parseModelWhere } from "../libs";

export async function getOne( req: Request, res: Response, next: NextFunction ) {
    const { object } = req.params;

    try {
        if ( object === "weapon-type" ) {
            const item = await BuildWeaponTypeRepository.findOne(
                parseModelWhere( BuildWeaponTypeRepository, req ) );
            return res.json( { item } );
        } else if ( object === "weapon" ) {
            const item = await BuildWeaponRepository.findOne(
                parseModelWhere( BuildWeaponRepository, req ) );
            return res.json( { item } );
        } else if ( object === "attachment" ) {
            const item = await BuildAttachmentRepository.findOne(
                parseModelWhere( BuildAttachmentRepository, req ) );
            return res.json( { item } );
        } else if ( object === "attachment-type" ) {
            const item = await BuildAttachmentTypeRepository.findOne(
                parseModelWhere( BuildAttachmentTypeRepository, req ) );
            return res.json( { item } );
        }
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }

    return res.json( { items: [] } );
}
