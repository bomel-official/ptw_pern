import { AMOUNT_ROUNDS } from "@constants";
import {
    ParticipantRepository,
    ParticipantRequest,
    ParticipantRequestRepository,
    TournamentRepository,
    UserRepository,
} from "@core";
import { ApiError } from "@error";
import { ParticipantRequestData } from "./participant-request.validation";

export const participantRequestService = {
    async create( data: ParticipantRequestData ): Promise<ParticipantRequest> {
        const { participantId, dataArray, places, filename, reqUserId } = data;

        const participant = await ParticipantRepository.findByPk( participantId, {
            include: [ { model: UserRepository, as: "users" } ],
        } );
        if ( !participant || !participant.users.find( ( user ) => user.id === reqUserId ) ) {
            throw ApiError.badRequest( "Некорректный запрос" );
        }

        const tournament = await TournamentRepository.findByPk( participant.tournamentId );
        if ( !tournament ) {
            throw ApiError.badRequest( "Турнир не найден" );
        }

        for ( let j = 0; j < AMOUNT_ROUNDS; j++ ) {
            for ( let i = 0; i < tournament.playersInTeam; i++ ) {
                if ( typeof dataArray[i][j] !== "number" ) {
                    throw ApiError.badRequest( "Некорректно заполнена таблица убийств" );
                }
            }
            if ( places[j].length !== 2 || typeof places[j][0] !== "number" || typeof places[j][1] !== "number" ) {
                throw ApiError.badRequest( "Некорректно заполнены места" );
            }
        }

        const newParticipantRequest = await ParticipantRequestRepository.create( {
            dataArray,
            places,
            approveUrl: filename,
            participantId,
        } );

        participant.set( { dataArray: newParticipantRequest.dataArray } );
        await participant.save();

        return newParticipantRequest;
    },

    async updateStatus( participantRequestId: number, status: string ): Promise<boolean> {
        const participantRequest = await ParticipantRequestRepository.findByPk( participantRequestId );
        if ( !participantRequest ) {
            return false;
        }
        const participant = await ParticipantRepository.findByPk( participantRequest.participantId );
        if ( !participant ) {
            return false;
        }

        if ( status === "approved" ) {
            participant.set( { dataArray: participantRequest.dataArray } );
            await participant.save();
        }
        if ( status === "discarded" ) {
            await participantRequest.destroy();
        }
        return true;
    },
};
