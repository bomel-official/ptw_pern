import {
    BuildAttachment,
    BuildAttachmentType,
    BuildMode,
    BuildWeapon,
    BuildWeaponType,
    CV
} from "@core";
import { Request } from "express";
import { Op } from "sequelize";

export const parseModelWhere = (
    WhereClass:
        typeof BuildAttachment |
        typeof BuildAttachmentType |
        typeof BuildMode |
        typeof BuildWeapon |
        typeof BuildWeaponType,
    req: Request
) => {
    return {
        where: {
            [Op.and]: Object.entries( req.query ).map(
                ( [ key, value ] ) => (((value !== "null" && key in
                        WhereClass.rawAttributes) &&
                    !(key === "gameVersion" && value === "wz")) ?
                    { [key]: new CV( value, { label: key } ).string().val } :
                    {}) )
        },
        order: [ [ "title_RU", "ASC" ] ] as [ string, string ][]
    };
};
