import { useEffect, useState } from "react";
import { useParticipants } from "../../components/tournament/TournamentRating/hooks";
import {
    CompetitionTable,
    CompetitionTableDTO,
    CompetitionTableDTORequest,
    IMessageOptions,
    ITournament
} from "../../StoreTypes";
import { TOURNAMENT_COMPETITION_TABLE_DEFAULT } from "../competition";
import { usePostPutOneCompetitionTable } from "../competition-table";
import { useTypedHttp } from "../http.hook";
import { ResponseData } from "../types";

export function useRatingTable( tournament: ITournament | null ) {
    const [ table, setTable ] = useState<CompetitionTableDTO>( TOURNAMENT_COMPETITION_TABLE_DEFAULT );
    const [ isEdit, setIsEdit ] = useState<boolean>( false );
    const { participants } = useParticipants( tournament, "users" );
    const [ messageOptions, setMessageOptions ] = useState<IMessageOptions>( {
        status: "", text: ""
    } );
    const { request, loading, error } = useTypedHttp<ResponseData<CompetitionTable>, CompetitionTableDTORequest>();

    useEffect( () => {
        if ( tournament ) {
            if ( tournament.competitionTable && tournament.competitionTable.tournamentId ) {
                setTable( tournament.competitionTable );
            }
        }
    }, [ tournament ] );

    useEffect( () => {
        const teams = participants.map( participant => participant.team ).filter( team => !!team );
        setTable( ( prevState ) => ({ ...prevState, teams }) );
    }, [ participants ] );

    const {
        toggleIsOutsiders, setOutsider, shuffle, setParticipant, setParticipantType, setItemsInTeam, addItem,
        removeItem, toggleAllowShuffle, saveTable
    } = usePostPutOneCompetitionTable( setTable );

    async function save() {
        try {
            if ( tournament && tournament.id ) {
                const data = await saveTable( table, "tournament", tournament.id, request );
                setMessageOptions( {
                    status: "pos", text: "Турнир успешно сохранён!"
                } );
                setIsEdit( false );
            }
        } catch ( e ) {
            setMessageOptions( {
                status: "neg", text: (e as { message?: string })?.message ?? "Ошибка..."
            } );
        }
    }

    return {
        toggleIsOutsiders, setOutsider, shuffle, setParticipant, setParticipantType, setItemsInTeam, addItem,
        removeItem, toggleAllowShuffle, table, loading, save, isEdit, setIsEdit, messageOptions
    };
}
