import { Game } from "@constants";
import {
    BuildAttachmentRepository,
    BuildAttachmentTypeRepository,
    BuildWeaponRepository,
    BuildWeaponTypeRepository,
    CV,
    generateValidator,
    isError
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { uploadImage } from "../libs";

export async function postOne( req: Request, res: Response, next: NextFunction ) {
    const { object } = req.params;

    if ( object === "weapon-type" ) {
        const validated = generateValidator(
            () => ({
                title_RU: new CV( req.body.title_RU,
                    { label: "title_RU" } ).string().val,
                title_EU: new CV( req.body.title_EU,
                    { label: "title_EU" } ).string().val,
            }) );
        if ( isError( validated ) ) {
            return next(validated.errorObject);
        }
        const { title_RU, title_EU } = validated.data;

        const newItem = await BuildWeaponTypeRepository.create( {
            title_EU, title_RU
        } );

        return res.json( { message: "Добавлено!", item: newItem } );
    } else if ( object === "weapon" ) {
        const validated = generateValidator(
            () => ({
                title_RU: new CV( req.body.title_RU,
                    { label: "title_RU" } ).string().val,
                title_EU: new CV( req.body.title_EU,
                    { label: "title_EU" } ).string().val,
                buildWeaponTypeId: new CV( req.body.buildWeaponTypeId,
                    { label: "buildWeaponTypeId" } ).number().val,
                gameVersion: new CV( req.body.gameVersion,
                    { label: "gameVersion" } ).string()
                    .included( Object.values( Game ) as Game[] ).val,
                allowedAttachments: new CV( req.body.allowedAttachments,
                    { label: "allowedAttachments" } ).array(
                    (attachment => new CV( attachment ).number().val) ).val
            }) );
        if ( isError( validated ) ) {
            return next(validated.errorObject);
        }
        const {
            title_RU, title_EU, buildWeaponTypeId, gameVersion,
            allowedAttachments
        } = validated.data;

        const { image } = req.files || { image: null };
        const filename = await uploadImage( image, {
            width: 352, height: 180
        } );

        const newItem = await BuildWeaponRepository.create( {
            title_EU,
            title_RU,
            buildWeaponTypeId,
            image: filename,
            gameVersion,
            allowedAttachments
        } );

        return res.json( { message: "Добавлено!", item: newItem } );
    } else if ( object === "attachment" ) {
        const validated = generateValidator(
            () => ({
                title_RU: new CV( req.body.title_RU,
                    { label: "title_RU" } ).string().val,
                title_EU: new CV( req.body.title_EU,
                    { label: "title_EU" } ).string().val,
                buildAttachmentTypeId: new CV( req.body.buildAttachmentTypeId,
                    { label: "buildAttachmentTypeId" } ).number().val,
                gameVersion: new CV( req.body.gameVersion,
                    { label: "gameVersion" } ).string()
                    .included( Object.values( Game ) as Game[] ).val
            }) );
        if ( isError( validated ) ) {
            return next(validated.errorObject);
        }
        const {
            title_RU, title_EU, buildAttachmentTypeId, gameVersion,
        } = validated.data;

        const { image } = req.files || { image: null };
        const filename = await uploadImage( image, {
            width: 352, height: 180
        } );

        const newItem = await BuildAttachmentRepository.create( {
            title_EU,
            title_RU,
            gameVersion,
            buildAttachmentTypeId,
            image: filename
        } );

        return res.json( { message: "Добавлено!", item: newItem } );
    } else if ( object === "attachment-type" ) {
        const validated = generateValidator(
            () => ({
                title_RU: new CV( req.body.title_RU,
                    { label: "title_RU" } ).string().val,
                title_EU: new CV( req.body.title_EU,
                    { label: "title_EU" } ).string().val,
            }) );
        if ( isError( validated ) ) {
            return next(validated.errorObject);
        }
        const { title_RU, title_EU } = validated.data;

        const newItem = await BuildAttachmentTypeRepository.create( {
            title_EU, title_RU
        } );

        return res.json( { message: "Добавлено!", item: newItem } );
    }

    return next( ApiError.badRequest( "Неверно заполены данные" ) );
}
