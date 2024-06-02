import { Game } from "@constants";
import {
    Build,
    BuildWeapon,
    BuildWeaponType, CV,
    generateValidator, isError,
    User
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function getManyBuild( req: Request, res: Response,
                                    next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            s: new CV( req.body.id, { label: "s" } ).string().val,
            userId: new CV( req.body.userId,
                { label: "userId" } ).number().val,
            weaponTypeId: new CV( req.body.weaponTypeId,
                { label: "weaponTypeId" } ).number().val,
            weaponId: new CV( req.body.weaponId,
                { label: "weaponId" } ).number().val,
            buildType: new CV( req.body.buildType,
                { label: "buildType" } ).string().val,
        }) );
    if ( isError( validated ) ) {
        return validated.errorObject;
    }
    const { s, userId, weaponTypeId, weaponId, buildType } = validated.data;

    let userQuery: {
        isMeta?: boolean;
        userId?: number;
    } = {};
    if ( buildType === "admin" ) {
        userQuery = {
            ...userQuery,
            isMeta: true
        };
    }
    if ( userId ) {
        userQuery = {
            ...userQuery,
            userId
        };
    }

    try {
        const { rows: items } = await Build.findAndCountAll( {
            where: {
                [Op.and]: [
                    s ? {
                        [Op.or]: [
                            {
                                "$user.nickname$": {
                                    [Op.substring]: s
                                }
                            },
                            {
                                "$build_weapon.title_RU$": {
                                    [Op.substring]: s
                                }
                            },
                            {
                                "$build_weapon.title_EU$": {
                                    [Op.substring]: s
                                }
                            }
                        ]
                    } : {},
                    userQuery,
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
                    model: User,
                    as: "user"
                },
                {
                    model: BuildWeapon,
                    as: "build_weapon"
                },
                {
                    model: BuildWeaponType,
                    as: "build_weapon_type"
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
