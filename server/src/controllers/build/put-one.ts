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

export async function putOne( req: Request, res: Response, next: NextFunction ) {
    const validatedObject = generateValidator(
        () => ({
            object: new CV( req.params.object,
                { label: "object" } ).string().val
        }) );
    if ( isError( validatedObject ) ) {
        return next( validatedObject.errorObject );
    }
    const { object } = validatedObject.data;

    if ( object === "weapon-type" ) {
        const validated = generateValidator(
            () => ({
                id: new CV( req.body.id, { label: "id" } ).number().val,
                title_RU: new CV( req.body.title_RU,
                    { label: "title_RU" } ).string().val,
                title_EU: new CV( req.body.title_EU,
                    { label: "title_EU" } ).string().val,
            }) );
        if ( isError( validated ) ) {
            return next( validated.errorObject );
        }
        const { id, title_RU, title_EU } = validated.data;

        const item = await BuildWeaponTypeRepository.findByPk( id );
        if ( !item ) return next(
            ApiError.badRequest( "Редактируемый объект не найден" ) );

        item.set( {
            title_EU, title_RU
        } );
        await item.save();

        return res.json( { message: "Обновлено!", item } );
    } else if ( object === "weapon" ) {
        const validated = generateValidator(
            () => ({
                id: new CV( req.body.id, { label: "id" } ).number().val,
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
            return next( validated.errorObject );
        }
        const {
            id, title_RU, title_EU, buildWeaponTypeId, gameVersion,
            allowedAttachments
        } = validated.data;

        const { image } = req.files || { image: null };
        const filename = await uploadImage( image, {
            width: 352, height: 180
        } );

        const item = await BuildWeaponRepository.findByPk( id );
        if ( !item ) return next(
            ApiError.badRequest( "Редактируемый объект не найден" ) );

        item.set( {
            title_EU,
            title_RU,
            buildWeaponTypeId,
            image: filename || item.image,
            gameVersion,
            allowedAttachments
        } );
        await item.save();

        return res.json( { message: "Обновлено!", item } );
    } else if ( object === "attachment" ) {
        const validated = generateValidator(
            () => ({
                id: new CV( req.body.id, { label: "id" } ).number().val,
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
            return next( validated.errorObject );
        }
        const {
            id, title_RU, title_EU, buildAttachmentTypeId, gameVersion,
        } = validated.data;

        const { image } = req.files || { image: null };
        const filename = await uploadImage( image, {
            width: 352, height: 180
        } );

        const item = await BuildAttachmentRepository.findByPk( id );
        if ( !item ) return next(
            ApiError.badRequest( "Редактируемый объект не найден" ) );

        item.set( {
            title_EU,
            title_RU,
            gameVersion,
            buildAttachmentTypeId,
            image: filename || item.image
        } );
        await item.save();

        return res.json( { message: "Обновлено!", item } );
    } else if ( object === "attachment-type" ) {
        const validated = generateValidator(
            () => ({
                id: new CV( req.body.id, { label: "id" } ).number().val,
                title_RU: new CV( req.body.title_RU,
                    { label: "title_RU" } ).string().val,
                title_EU: new CV( req.body.title_EU,
                    { label: "title_EU" } ).string().val,
            }) );
        if ( isError( validated ) ) {
            return next( validated.errorObject );
        }
        const { id, title_RU, title_EU } = validated.data;

        const item = await BuildAttachmentTypeRepository.findByPk( id );
        if ( !item ) return next(
            ApiError.badRequest( "Редактируемый объект не найден" ) );

        item.set( {
            title_EU, title_RU
        } );
        await item.save();

        return res.json( { message: "Обновлено!", item } );
    }

    return next( ApiError.badRequest( "Неверно заполены данные" ) );
}
