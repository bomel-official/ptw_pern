import { asyncHandler } from "@shared";
import { userService } from "./user.service";

export const userController = {
    getMany: asyncHandler( async ( req, res ) => {
        const { count, rows } = await userService.search( req.query.s, req.query.friendOf );
        return res.json( { message: `Пользователей найдено: ${ count }`, rows } );
    } ),

    getManyAdmins: asyncHandler( async ( req, res ) => {
        const rows = await userService.getAdmins();
        return res.json( { rows } );
    } ),

    getOne: asyncHandler( async ( req, res ) => {
        const result = await userService.getById( req.params.id );
        if ( !result ) {
            return res.json( { message: "Ничего не найдено" } );
        }
        return res.json( { data: result } );
    } ),

    getOneByNickname: asyncHandler( async ( req, res ) => {
        const user = await userService.getByNickname( req.params.nickname );
        if ( !user ) {
            return res.json( { message: "Ничего не найдено" } );
        }
        return res.json( { data: user } );
    } ),

    create: asyncHandler( async ( req, res ) => {
        const token = await userService.create( req.body );
        return res.json( { token } );
    } ),

    update: asyncHandler( async ( req, res ) => {
        const avatar = req.files?.avatar ?? null;
        const result = await userService.update( { ...req.body, avatar } );
        if ( !result.ok ) {
            return res.json( { status: "neg", text: result.text } );
        }
        return res.json( { message: "Данные успешно обновлены!" } );
    } ),

    updateRole: asyncHandler( async ( req, res ) => {
        await userService.updateRole( req.body.userId, req.body.role );
        return res.json( { message: "Успех!" } );
    } ),
};
