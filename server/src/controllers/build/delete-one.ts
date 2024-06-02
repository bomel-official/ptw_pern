import {
    BuildAttachment,
    BuildAttachmentType,
    BuildWeapon,
    BuildWeaponType
} from "@core";
import { NextFunction, Request, Response } from "express";

export async function deleteOne( req: Request, res: Response,
                                 next: NextFunction ) {
    const { object } = req.params;
    const { itemId } = req.body;

    if ( object === "weapon-type" ) {
        await BuildWeaponType.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    } else if ( object === "weapon" ) {
        await BuildWeapon.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    } else if ( object === "attachment" ) {
        await BuildAttachment.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    } else if ( object === "attachment-type" ) {
        await BuildAttachmentType.destroy( { where: { id: itemId } } );
        return res.json( { message: "Удалено!" } );
    }

    return res.json( { message: "Ошибка..." } );
}
