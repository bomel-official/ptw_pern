import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Competition, CompetitionDTO, CompetitionDTORequest, IMessageOptions, IUser } from "../../StoreTypes";
import { useTypedHttp } from "../http.hook";
import { ResponseData } from "../types";
import { COMPETITION_DEFAULT, COMPETITION_EMPTY_NUMBER_VALUE } from "./constants";

export function usePostPutOneCompetition( defaultValue?: CompetitionDTO | null ) {
    const [ data, setData ] = useState<CompetitionDTO>( COMPETITION_DEFAULT );
    const [ isEdit, setIsEdit ] = useState( false );
    const { request, loading, error, clearError } = useTypedHttp<ResponseData<Competition>, CompetitionDTORequest>();
    const [ messageOptions, setMessageOptions ] = useState<IMessageOptions>( {
        status: "", text: ""
    } );
    const navigate = useNavigate();

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

    function toggleIsOutsiders() {
        setData( ( prevState ) => ({ ...prevState, isOutsiders: !prevState.isOutsiders }) );
    }

    function setParticipantsAmount( newParticipantsAmount: number ) {
        const cellAmount = 2 ** (Math.ceil( Math.log( newParticipantsAmount ) / Math.log( 2 ) ));

        const newParticipants: CompetitionDTO["participants"] = [];
        const newParticipantsUsers: CompetitionDTO["participantsUsers"] = [];
        const newOutsiders: CompetitionDTO["outsiders"] = [];
        const newOutsidersUsers: CompetitionDTO["outsidersUsers"] = [];

        for ( let power = 0; 2 ** power <= cellAmount; power++ ) {
            const newArrayNum: number[] = [];
            const newArrayNull: (IUser | null)[] = [];
            for ( let i = 0; i < cellAmount / (2 ** power); i++ ) {
                newArrayNum.push( -1 );
                newArrayNull.push( null );
            }
            if ( data.participants[power] ) {
                newParticipants[power] = [ ...newArrayNum ].map(
                    ( _, index ) => (data.participants[power][index] === undefined ? _ :
                        data.participants[power][index]) );
            } else {
                newParticipants[power] = [ ...newArrayNum ];
            }

            if ( data.participantsUsers[power] ) {
                newParticipantsUsers[power] = [ ...newArrayNull ].map(
                    ( _, index ) => (data.participantsUsers[power][index] !== undefined ?
                        data.participantsUsers[power][index] : _) );
            } else {
                newParticipantsUsers[power] = [ ...newArrayNull ];
            }

            if ( data.outsiders[power] ) {
                newOutsiders[power] = [ ...newArrayNum ].map(
                    ( _, index ) => (data.outsiders[power][index] !== undefined ?
                        data.outsiders[power][index] : _) );
            } else {
                newOutsiders[power] = [ ...newArrayNum ];
            }

            if ( data.outsidersUsers[power] ) {
                newOutsidersUsers[power] = [ ...newArrayNull ].map(
                    ( _, index ) => (data.outsidersUsers[power][index] !== undefined ?
                        data.outsidersUsers[power][index] : _) );
            } else {
                newOutsidersUsers[power] = [ ...newArrayNull ];
            }
        }

        setData( ( prevState ) => ({
            ...prevState, participants: newParticipants, participantsUsers: newParticipantsUsers,
            outsiders: newOutsiders, outsidersUsers: newOutsidersUsers,
            participantsAmount: newParticipantsAmount
        }) );
    }

    function setParticipant( user: IUser | null, rowIndex: number, index: number ) {
        setData( ( prevState ) => {
            const newParticipants = prevState.participants.map(
                ( row, _rowIndex ) =>
                    (rowIndex === _rowIndex ? row.map( ( item, _index ) =>
                        (_index === index ? (user ? user.id : COMPETITION_EMPTY_NUMBER_VALUE) : item)
                    ) : [ ...row ])
            );
            const newParticipantsUsers = prevState.participantsUsers.map(
                ( row, _rowIndex ) =>
                    (rowIndex === _rowIndex ? row.map( ( item, _index ) =>
                        (_index === index ? user : item)
                    ) : [ ...row ])
            );
            return ({
                ...prevState,
                participants: newParticipants,
                participantsUsers: newParticipantsUsers,
            });
        } );
    }

    function setOutsider( user: IUser | null, rowIndex: number, index: number ) {
        setData( ( prevState ) => {
            const newOutsiders = prevState.outsiders.map(
                ( row, _rowIndex ) =>
                    (rowIndex === _rowIndex ? row.map( ( item, _index ) =>
                        (_index === index ? (user ? user.id : COMPETITION_EMPTY_NUMBER_VALUE) : item)
                    ) : [ ...row ])
            );
            const newOutsidersUsers = prevState.outsidersUsers.map(
                ( row, _rowIndex ) =>
                    (rowIndex === _rowIndex ? row.map( ( item, _index ) =>
                        (_index === index ? user : item)
                    ) : [ ...row ])
            );
            return ({
                ...prevState,
                outsiders: newOutsiders,
                outsidersUsers: newOutsidersUsers
            });
        } );
    }

    async function save() {
        try {
            const requestData: CompetitionDTORequest = {
                title: data.title,
                participantsAmount: data.participantsAmount,
                participants: data.participants,
                isOutsiders: data.isOutsiders,
                outsiders: data.outsiders,
                ...(data.id ? { id: data.id } : {})
            };
            const response = await request( "/api/competition", "POST", requestData );
            setMessageOptions( {
                status: "pos", text: "Турнир успешно сохранён!"
            } );
            setIsEdit( false );
            navigate( `/competition/${ response.data.id }` );
        } catch ( e ) {
            setMessageOptions( {
                status: "neg", text: (e as { message?: string })?.message ?? "Ошибка..."
            } );
        }
    }

    return {
        data, setTitle, setParticipantsAmount, loading, error, setParticipant, toggleIsOutsiders, setOutsider,
        messageOptions, save, isEdit, setIsEdit
    };
}
