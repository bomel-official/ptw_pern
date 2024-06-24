import { Game } from "@constants";
import { BuildRepository, CV, generateValidator, isError } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function postOneBuild( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            weaponTypeId: new CV( req.body.weaponTypeId,
                { label: "weaponTypeId" } ).number().val,
            title: new CV( req.body.title,
                { label: "title" } ).string().val,
            weaponId: new CV( req.body.weaponId,
                { label: "weaponId" } ).number().val,
            buildWeaponTypeId: new CV( req.body.buildWeaponTypeId,
                { label: "buildWeaponTypeId" } ).number().val,
            gameVersion: new CV( req.body.gameVersion,
                { label: "gameVersion" } ).string()
                .included( Object.values( Game ) as Game[] ).val,
            attachments: new CV( req.body.attachments,
                { label: "attachments" } ).array(
                (attachment => new CV( attachment ).object( ( att ) => ({
                    attachment: new CV( att.attachment ).number().val,
                    attachmentType: new CV( att.attachmentType ).number().val,
                    range: new CV( att.range ).array( (rangeItem => new CV( rangeItem ).number().val) ).val,
                }) ).val) ).val
        }) );
    if ( isError( validated ) ) {
        return validated.errorObject;
    }
    const {
        title, weaponId, weaponTypeId, gameVersion, attachments: parsedAttachments
    } = validated.data;

    if ( title.length < 3 ) {
        return next(
            ApiError.badRequest( "Название должно быть длиннее 3 символов" ) );
    }

    if ( !req.user || !req.user.id ) {
        return next(
            ApiError.unauthorized( "Не авторизован" ) );
    }

    try {
        const newItem = await BuildRepository.create( {
            title,
            userId: req.user.id,
            gameVersion,
            buildWeaponId: weaponId,
            buildWeaponTypeId: weaponTypeId,
            attachments: parsedAttachments.map(
                att => ([ att.attachment, att.attachmentType, att.range[0],
                    att.range[1] ]) )
        } );
        return res.json(
            { message: "Сборка успешно создана!", item: newItem } );
    } catch ( e ) {
        console.log( e );
        return next( ApiError.badRequest( "Поля заполнены некорректно..." ) );
    }
}
