import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Competition, CompetitionDTO, CompetitionDTORequest, IMessageOptions } from "../../StoreTypes";
import { usePostPutOneCompetitionTable } from "../competition-table";
import { useTypedHttp } from "../http.hook";
import { ResponseData } from "../types";
import { COMPETITION_DEFAULT } from "./constants";

export function usePostPutOneCompetition( defaultValue?: CompetitionDTO | null ) {
    const [ data, setData ] = useState<CompetitionDTO>( COMPETITION_DEFAULT );
    const [ isEdit, setIsEdit ] = useState( false );
    const { request, loading, error } = useTypedHttp<ResponseData<Competition>, CompetitionDTORequest>();
    const [ messageOptions, setMessageOptions ] = useState<IMessageOptions>( {
        status: "", text: ""
    } );
    const navigate = useNavigate();
    const items = data.competitionTable.type === "user" ? data.competitionTable.users : data.competitionTable.teams;

    useEffect( () => {
        if ( defaultValue ) {
            setData( defaultValue );
            setIsEdit( false );
        } else {
            setIsEdit( true );
        }
    }, [ defaultValue ] );

    function setTitle( newTitle: string ) {
        setData( ( prevState ) => ({ ...prevState, title: newTitle }) );
    }

    const {
        toggleIsOutsiders, setOutsider, shuffle, setParticipant, setParticipantType, setItemsInTeam, addItem,
        removeItem, toggleAllowShuffle, saveTable
    } = usePostPutOneCompetitionTable( ( dispatch ) => {
        setData( prevState => ({ ...prevState, competitionTable: dispatch( prevState.competitionTable ) }) );
    } );

    async function save() {
        try {
            const requestData: CompetitionDTORequest = {
                ...(data.id ? { id: data.id } : {}),
                title: data.title,
                participantsAmount: items.length,
            };
            const { data: competition } = await request( "/api/competition", "POST", requestData );
            const table = saveTable( data.competitionTable, "competition", competition.id, request );
            setMessageOptions( {
                status: "pos", text: "Турнир успешно сохранён!"
            } );
            setIsEdit( false );
            navigate( `/competition/${ competition.id }` );
        } catch ( e ) {
            setMessageOptions( {
                status: "neg", text: (e as { message?: string })?.message ?? "Ошибка..."
            } );
        }
    }

    return {
        data, setTitle, loading, error, toggleIsOutsiders,
        messageOptions, save, isEdit, setIsEdit, addItem, removeItem, toggleAllowShuffle, setParticipantType, items,
        setItemsInTeam, shuffle, setParticipant, setOutsider
    };
}
