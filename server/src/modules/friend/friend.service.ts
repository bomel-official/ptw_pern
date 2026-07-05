import { FriendRequest, FriendRequestRepository, User, UserRepository } from "@core";
import { ApiError } from "@error";
import { withTransaction } from "@shared";
import { Op } from "sequelize";
import { areFriends } from "../../controllers/libs";

export const friendService = {
    async getFriends( userId: string ): Promise<{ count: number; friends: User[] }> {
        const user = await UserRepository.findByPk( userId );
        if ( !user ) {
            throw ApiError.badRequest( "Пользователь не найден" );
        }
        const { count, rows: friends } = await UserRepository.findAndCountAll( {
            where: { id: user.friends },
        } );
        return { count, friends };
    },

    async getRequests( userId: string ): Promise<{ count: number; requests: FriendRequest[] }> {
        const { count, rows: requests } = await FriendRequestRepository.findAndCountAll( {
            where: { [Op.and]: [ { userToId: userId }, { isAccepted: false } ] },
            include: { model: UserRepository, as: "user_from" },
        } );
        return { count, requests };
    },

    async add( from: number, to: number ): Promise<string> {
        const recipient = await UserRepository.findByPk( to );
        const sender = await UserRepository.findByPk( from );
        if ( !sender || !recipient ) {
            throw ApiError.badRequest( "Пользователь не найден" );
        }

        if ( areFriends( recipient, sender ) ) {
            return "Пользователь является вашим другом";
        }

        const existingRequest = await FriendRequestRepository.findOne( {
            where: { userToId: to, userFromId: from },
        } );
        if ( existingRequest ) {
            return "Заявка отправлена!";
        }

        const oppositeRequest = await FriendRequestRepository.findOne( {
            where: { userToId: from, userFromId: to },
        } );

        if ( oppositeRequest ) {
            await withTransaction( async ( t ) => {
                await recipient.update( { friends: [ ...recipient.friends, sender.id ] }, { transaction: t } );
                await sender.update( { friends: [ ...sender.friends, recipient.id ] }, { transaction: t } );
                await oppositeRequest.update( { isAccepted: true }, { transaction: t } );
            } );
            return "Пользователь добавлен в друзья!";
        }

        await FriendRequestRepository.create( { userToId: to, userFromId: from, isAccepted: false } );
        return "Заявка отправлена!";
    },

    async remove( from: number, to: number ): Promise<void> {
        const toUser = await UserRepository.findByPk( to );
        const fromUser = await UserRepository.findByPk( from );
        if ( !toUser || !fromUser ) {
            throw ApiError.badRequest( "Пользователь не найден" );
        }

        await withTransaction( async ( t ) => {
            await toUser.update(
                { friends: toUser.friends.filter( ( friendId ) => friendId !== from ) },
                { transaction: t },
            );
            await fromUser.update(
                { friends: fromUser.friends.filter( ( friendId ) => friendId !== to ) },
                { transaction: t },
            );
            await FriendRequestRepository.destroy( {
                where: {
                    [Op.or]: [
                        { userFromId: from, userToId: to },
                        { userFromId: to, userToId: from },
                    ],
                },
                transaction: t,
            } );
        } );
    },
};
