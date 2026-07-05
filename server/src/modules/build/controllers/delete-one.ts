import {
    BuildAttachmentRepository,
    BuildAttachmentTypeRepository,
    BuildWeaponRepository,
    BuildWeaponTypeRepository
} from "@core";
import { NextFunction, Request, Response } from "express";

export async function deleteOne( req: Request, res: Response, next: NextFunction ) {
    const { object } = req.params;
    const { itemId } = req.body;

    if ( object === "weapon-type" ) {
        await BuildWeaponTypeRepository.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    } else if ( object === "weapon" ) {
        await BuildWeaponRepository.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    } else if ( object === "attachment" ) {
        await BuildAttachmentRepository.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    } else if ( object === "attachment-type" ) {
        await BuildAttachmentTypeRepository.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    }

    return res.json( { message: "Ошибка..." } );
}
