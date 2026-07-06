import { AMOUNT_ROUNDS } from "@constants";
import {
    InvoiceRepository,
    JWTUserData,
    Participant,
    ParticipantRepository,
    ParticipantRequestRepository,
    ParticipantUserRepository,
    TeamRepository,
    TournamentRepository,
    User,
    UserRepository,
} from "@core";
import { ApiError } from "@error";
import { paymentService } from "@modules/payment";
import { withTransaction } from "@shared";
import { Op } from "sequelize";
import { calcAmountKills, isAdmin } from "../../controllers/libs";
import { computeParticipantPoints, getParticipantRoomNumber } from "./participant.lib";
import { PutManyItem, RegisterBody } from "./participant.validation";

export const participantService = {
    async register( body: RegisterBody, reqUserId: number ): Promise<{ url?: string }> {
        const { teamId, players, tournamentId, id, payMethod } = body;

        const tournament = await TournamentRepository.findByPk( tournamentId );
        const team = await TeamRepository.findByPk( teamId );
        const reqUser = await UserRepository.findByPk( reqUserId );

        if ( !reqUser ) {
            throw ApiError.badRequest( "Пользователь не найден, перезайдите" );
        }
        if ( !tournament ) {
            throw ApiError.badRequest( "Турнир не найден" );
        }
        if ( !team ) {
            throw ApiError.badRequest( "Команда не найдена" );
        }
        if ( team.capitanId !== reqUser.id && !isAdmin( reqUser ) ) {
            throw ApiError.forbidden( "Нет доступа" );
        }
        if ( players.length !== tournament.playersInTeam ) {
            throw ApiError.badRequest( "Некорректное количество участников!" );
        }

        const alreadyRegistered = await ParticipantRepository.findOne( {
            where: {
                ...(id ? { id: { [Op.ne]: id } } : {}),
                tournamentId: tournament.id,
            },
            include: [ {
                model: UserRepository,
                as: "users",
                where: { id: { [Op.in]: players } },
            } ],
        } );
        if ( alreadyRegistered && alreadyRegistered.users[0] ) {
            throw ApiError.badRequest(
                `${ alreadyRegistered.users[0].nickname } - уже учавствует в другой команде` );
        }

        if ( !id || isAdmin( reqUser ) ) {
            // Create participant
            const roomNumber = await getParticipantRoomNumber( tournament.id );

            const created = await withTransaction( async ( t ) => {
                const newReq = await ParticipantRepository.create( {
                    tournamentId: tournament.id,
                    points: 0,
                    teamId: team.id,
                    payMethod,
                    isRoundsHidden: Array( AMOUNT_ROUNDS ).fill( false ),
                    dataArray: Array( players.length ).fill( Array( AMOUNT_ROUNDS ).fill( 0 ) ),
                    places: Array( AMOUNT_ROUNDS ).fill( [ -1, 0 ] ),
                    roomNumber,
                }, { transaction: t } );

                for ( const playerId of players ) {
                    const player = await UserRepository.findByPk( playerId, { transaction: t } );
                    if ( !player ) {
                        throw ApiError.badRequest( "Ошибка, некорректный запрос" );
                    }
                    await newReq.addUser( player, { transaction: t } );
                    await tournament.addPlayer( player, { transaction: t } );
                }
                return newReq;
            } );

            if ( tournament.participationPrice ) {
                const yookassaParticipant = (await paymentService.createInvoice( created.id )).participant;
                if ( yookassaParticipant && yookassaParticipant.payMethod === "enot" ) {
                    return { url: yookassaParticipant.invoiceUrl };
                }
            }
            return {};
        }

        // Edit participant
        await withTransaction( async ( t ) => {
            const participant = await ParticipantRepository.findOne( {
                where: { id },
                include: { model: UserRepository, as: "users" },
                transaction: t,
            } );
            if ( !participant ) {
                throw ApiError.badRequest( "Участник не найден" );
            }

            participant.teamId = team.id;
            participant.payMethod = payMethod;
            await participant.save( { transaction: t } );

            const participantUsers = participant.users.map( ( user ) => user.id );
            const toAddUsers: User[] = [];
            const toRemoveUsers: User[] = [];

            for ( const playerId of players ) {
                const player = await UserRepository.findByPk( playerId, { transaction: t } );
                if ( player && !participantUsers.includes( player.id ) ) {
                    toAddUsers.push( player );
                }
            }
            participant.users.forEach( ( user ) => {
                if ( user && !players.includes( user.id ) ) {
                    toRemoveUsers.push( user );
                }
            } );
            for ( const user of toRemoveUsers ) {
                await participant.removeUser( user, { transaction: t } );
                await tournament.removePlayer( user, { transaction: t } );
            }
            for ( const user of toAddUsers ) {
                await participant.addUser( user, { transaction: t } );
                await tournament.addPlayer( user, { transaction: t } );
            }
        } );

        return {};
    },

    async remove(
        params: { participantId?: number; tournamentId?: number },
        reqUser: JWTUserData,
    ): Promise<void> {
        const { participantId, tournamentId } = params;

        let participant: Participant | null;
        if ( participantId ) {
            participant = await ParticipantRepository.findOne( {
                where: { id: participantId },
                include: [ { model: UserRepository } ],
            } );
        } else {
            participant = await ParticipantRepository.findOne( {
                where: { tournamentId },
                include: [ { model: UserRepository, as: "users", where: { id: reqUser.id } } ],
            } );
        }
        if ( !participant ) {
            throw ApiError.forbidden( "Ошибка сервера..." );
        }

        const participantUsers = await ParticipantUserRepository.findAll( {
            where: { participantId: participant.id },
        } );
        const participantPlayerIds = participantUsers.map( ( pu ) => pu.userId );

        const tournament = await TournamentRepository.findByPk( participant.tournamentId );
        if ( !tournament ) {
            throw ApiError.forbidden( "Ошибка сервера..." );
        }
        if ( !participantPlayerIds.includes( reqUser.id ) && !isAdmin( reqUser ) ) {
            throw ApiError.forbidden( "Нет доступа" );
        }

        const target = participant;
        await withTransaction( async ( t ) => {
            for ( const user of target.users ) {
                await tournament.$remove( "player", user, { transaction: t } );
            }
            await target.destroy( { transaction: t } );
        } );
    },

    getMany( tournamentId: number, type?: string ): Promise<Participant[]> {
        return ParticipantRepository.findAll( {
            where: { tournamentId },
            order: (!type || type === "users") ? [
                [ "roomNumber", "ASC" ],
                [ "id", "ASC" ],
                [ { model: UserRepository, as: "users" }, "id", "ASC" ],
            ] : [
                [ "points", "DESC" ],
                [ "priority", "DESC" ],
                [ "id", "ASC" ],
                [ { model: UserRepository, as: "users" }, "id", "ASC" ],
            ],
            include: [
                { model: UserRepository, as: "users" },
                { model: TeamRepository },
                { model: ParticipantRequestRepository },
            ],
        } );
    },

    async getOwn(
        tournamentId: number,
        userId: number,
    ): Promise<{ participant: Participant | null; participantUsers: unknown[] }> {
        const participant = await ParticipantRepository.findOne( {
            where: { tournamentId },
            include: [
                { model: UserRepository, as: "users", where: { id: userId } },
                {
                    model: TeamRepository,
                    as: "team",
                    include: [ { model: UserRepository, as: "players" } ],
                },
                { model: InvoiceRepository },
            ],
        } );
        if ( !participant ) {
            return { participant: null, participantUsers: [] };
        }
        const tournament = await TournamentRepository.findByPk( participant.tournamentId );
        if ( !tournament ) {
            return { participant: null, participantUsers: [] };
        }

        if ( tournament.participationPrice && !participant.isPaid ) {
            const isPaid = await paymentService.getStatus( participant.id );
            if ( isPaid ) {
                participant.isPaid = isPaid;
                await participant.save();
            }

            if ( participant.invoice && participant.invoice.expired ) {
                const invoiceExpired = new Date( participant.invoice.expired ).getTime();
                const now = new Date().getTime();
                if ( (invoiceExpired - 86400000) < now ) {
                    const updated = (await paymentService.createInvoice( participant.id )).participant;
                    participant.invoiceUrl = updated.invoiceUrl;
                    participant.invoiceId = updated.invoiceId;
                }
            } else if ( !participant.invoice ) {
                const updated = (await paymentService.createInvoice( participant.id )).participant;
                participant.invoiceUrl = updated.invoiceUrl;
                participant.invoiceId = updated.invoiceId;
            }
        }

        const participantUsers = await ParticipantUserRepository.findAll( {
            where: { participantId: participant.id },
        } );
        return { participant, participantUsers };
    },

    async putMany( participants: PutManyItem[] ): Promise<void> {
        if ( participants.length === 0 ) {
            return;
        }

        for ( const participant of participants ) {
            participant.points = computeParticipantPoints( participant );
        }
        participants.sort( ( a, b ) => b.points - a.points );

        const firstParticipant = await ParticipantRepository.findByPk( participants[0].id );
        if ( !firstParticipant ) {
            throw ApiError.badRequest( "Ошибка...." );
        }
        const tournamentId = firstParticipant.tournamentId;

        await withTransaction( async ( t ) => {
            const oldParticipants = await ParticipantRepository.findAll( {
                where: { tournamentId },
                order: [
                    [ "points", "DESC" ],
                    [ "id", "ASC" ],
                    [ { model: UserRepository, as: "users" }, "id", "ASC" ],
                ],
                include: [ { model: UserRepository, as: "users" } ],
                transaction: t,
            } );

            // Reverse previously applied stats
            for ( let i = 0; i < oldParticipants.length; i++ ) {
                const participant = oldParticipants[i];
                for ( let userIndex = 0; userIndex < participant.users.length; userIndex++ ) {
                    const user = participant.users[userIndex];
                    if ( user.statsToursList.includes( participant.tournamentId ) ) {
                        if ( i === 0 && user.statsToursWon > 0 ) {
                            user.statsToursWon -= 1;
                        }
                        if ( i < 3 && user.statsToursTop3 > 0 ) {
                            user.statsToursTop3 -= 1;
                        }
                        user.statsAmountKills -= calcAmountKills( participant.dataArray, userIndex );
                        await user.save( { transaction: t } );
                    }
                }
            }

            // Apply new stats + persist results
            for ( let i = 0; i < participants.length; i++ ) {
                const updatedParticipant = participants[i];
                const participant = await ParticipantRepository.findByPk( participants[i].id, {
                    order: [ [ { model: UserRepository, as: "users" }, "id", "ASC" ] ],
                    include: [ { model: UserRepository, as: "users" } ],
                    transaction: t,
                } );
                if ( !participant ) {
                    throw ApiError.badRequest( "Ошибка...." );
                }

                for ( let userIndex = 0; userIndex < participant.users.length; userIndex++ ) {
                    const user = participant.users[userIndex];
                    if ( !user.statsToursList.includes( participant.tournamentId ) ) {
                        user.statsToursList = [ ...user.statsToursList, participant.tournamentId ];
                    }
                    if ( i === 0 ) {
                        user.statsToursWon += 1;
                    }
                    if ( i < 3 ) {
                        user.statsToursTop3 += 1;
                    }
                    user.statsToursPlayed = user.statsToursList.length;
                    user.statsAmountKills += calcAmountKills( updatedParticipant.dataArray, userIndex );
                    user.statsAverageKills = user.statsAmountKills / (user.statsToursPlayed * AMOUNT_ROUNDS);
                    await user.save( { transaction: t } );
                }

                participant.dataArray = updatedParticipant.dataArray;
                participant.places = updatedParticipant.places;
                participant.isRoundsHidden = updatedParticipant.isRoundsHidden;
                participant.points = updatedParticipant.points;
                await participant.save( { transaction: t } );
            }
        } );
    },

    async increasePriority( participantId: number ): Promise<void> {
        const participant = await ParticipantRepository.findByPk( participantId );
        if ( participant ) {
            participant.priority += 1;
            await participant.save();
        }
    },

    async togglePayStatus( participantId: number ): Promise<void> {
        const participant = await ParticipantRepository.findByPk( participantId );
        if ( !participant ) {
            throw ApiError.badRequest( "Участник не найден" );
        }
        participant.isPaid = !participant.isPaid;
        await participant.save();
    },

    async redeclareRoomNumber( participantId: number ): Promise<void> {
        const participant = await ParticipantRepository.findByPk( participantId );
        if ( !participant ) {
            throw ApiError.badRequest( "Участник не найден" );
        }
        participant.roomNumber = await getParticipantRoomNumber( participant.tournamentId );
        await participant.save();
    },
};
