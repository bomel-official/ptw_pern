import {
    BuildRepository,
    BuildWeaponRepository,
    BuildWeaponTypeRepository,
    CV,
    generateValidator,
    isError,
    UserRepository
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function getManyBuild( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            s: new CV( req.query.s, { label: "s" } ).optional().string().val,
            userId: new CV( req.query.userId,
                { label: "userId" } ).optional().number().val,
            weaponTypeId: new CV( req.query.weaponTypeId,
                { label: "weaponTypeId" } ).optional().number().val,
            weaponId: new CV( req.query.weaponId,
                { label: "weaponId" } ).optional().number().val,
            buildType: new CV( req.query.buildType,
                { label: "buildType" } ).optional().string().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { s, userId, weaponTypeId, weaponId, buildType } = validated.data;

    try {
        const { rows: items } = await BuildRepository.findAndCountAll( {
            where: {
                [Op.and]: [
                    s ? {
                        [Op.or]: [
                            {
                                title: {
                                    [Op.iLike]: "%" + s + "%"
                                }
                            },
                            {
                                "$user.nickname$": {
                                    [Op.iLike]: "%" + s + "%"
                                }
                            },
                            {
                                "$build_weapon.title_RU$": {
                                    [Op.iLike]: "%" + s + "%"
                                }
                            },
                            {
                                "$build_weapon.title_EU$": {
                                    [Op.iLike]: "%" + s + "%"
                                }
                            }
                        ]
                    } : {},
                    {
                        ...(buildType === "admin" ? { isMeta: true } : {}),
                        ...(userId ? { userId } : {})
                    },
                    weaponTypeId ? {
                        buildWeaponTypeId: weaponTypeId
                    } : {},
                    weaponId ? {
                        buildWeaponId: weaponId
                    } : {},

                ]
            },
            include: [
                {
                    model: UserRepository,
                    as: "user"
                },
                {
                    model: BuildWeaponRepository,
                    as: "build_weapon",
                    foreignKey: "buildWeaponId"
                },
                {
                    model: BuildWeaponTypeRepository,
                    as: "build_weapon_type",
                    foreignKey: "buildWeaponTypeId"
                }
            ],
            limit: 15,
            order: [
                [ "likesCount", "DESC" ],
                [ "title", "ASC" ]
            ]
        } );
        return res.json( { items } );
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }
}
