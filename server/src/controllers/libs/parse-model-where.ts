import {
    BuildAttachmentRepository,
    BuildAttachmentTypeRepository,
    BuildModeRepository,
    BuildWeaponRepository,
    BuildWeaponTypeRepository,
    CV
} from "@core";
import { Request } from "express";
import { Op } from "sequelize";

export const parseModelWhere = (
    WhereClass:
        typeof BuildAttachmentRepository |
        typeof BuildAttachmentTypeRepository |
        typeof BuildModeRepository |
        typeof BuildWeaponRepository |
        typeof BuildWeaponTypeRepository,
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
