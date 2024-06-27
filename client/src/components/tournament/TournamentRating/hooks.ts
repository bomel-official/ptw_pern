import { Dispatch, useEffect, useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import {
    IMessageOptions,
    IParticipant,
    IParticipantRequest,
    IParticipantRequestDTO,
    ITournament,
    IUser
} from "../../../StoreTypes";
import { parseFormData } from "../../helpers/parseFormData";
import { isUserInParticipant } from "./helpers";
import { AMOUNT_ROUNDS, DEFAULT_ROUNDS_HIDDEN } from "./TournamentRating";

export const useParticipants = ( tournament: ITournament | null, type?: "users" | "rating", refetch?: boolean ) => {
    const [ participants, setParticipants ] = useState<Array<IParticipant>>( [] );
    const [ manualRefetchState, setManualRefetchState ] = useState( false );
    const { request, loading } = useHttp();

    const fetchParticipants = async () => {
        if ( tournament && tournament.id ) {
            const { participants: fetchedParticipants } = await request(
                `/api/tournament/get-participants?tournamentId=${ tournament.id }&type=${ type || "" }`, "GET" );
            setParticipants( fetchedParticipants );
        }
    };

    const manualRefetch = () => {
        setManualRefetchState( !manualRefetchState );
    };

    useEffect( () => {
        fetchParticipants().catch( () => {} );
    }, [ tournament, type, refetch, manualRefetchState ] );

    const changeCertainParticipant = ( index: number, value: IParticipant ) => {
        setParticipants( ( ptsps ) => ptsps.map( ( ptsp, i ) => {
            if ( i === index ) {
                return value;
            }
            return ptsp;
        } ) );
    };

    return {
        participants,
        setParticipants,
        loading,
        manualRefetch,
        changeCertainParticipant
    };
};

export const useParticipantRequest = ( participants: Array<IParticipant>, user: IUser | null,
                                       token: string | null ) => {
    const [ participantRequest, setParticipantRequest ] = useState<IParticipantRequestDTO | null>( null );
    const [ participant, setParticipant ] = useState<IParticipant | null>( null );
    const [ pIndex, setPIndex ] = useState<number>( -1 );
    const { request, loading } = useHttp();

    useEffect( () => {
        const participant = participants.find( ( ptsp, i ) => {
            if ( isUserInParticipant( ptsp, user ) ) {
                setPIndex( i );
                return true;
            }
            return false;
        } );
        if ( participant && user && !participantRequest ) {
            const dataArray = [];
            for ( const item of participant.users ) {
                const dataArrayItem = [];
                for ( let _j = 0; _j < AMOUNT_ROUNDS; _j++ ) {
                    dataArrayItem.push( 0 );
                }
                dataArray.push( dataArrayItem );
            }

            const places = [];
            for ( let _j = 0; _j < AMOUNT_ROUNDS; _j++ ) {
                places.push( [ -1, 0 ] );
            }

            setParticipantRequest( {
                participantId: participant.id,
                isRoundsHidden: Array( AMOUNT_ROUNDS ).fill( false ),
                dataArray,
                places: places as Array<[ number, number ]>,
                approve: null,
                approveFilename: "",
            } );
            setParticipant( participant );
        }
    }, [ participants ] );

    const changeParticipantRequestField = <TKey extends keyof IParticipantRequestDTO>( key: TKey,
                                                                                       value: IParticipantRequestDTO[TKey] ) => {
        if ( !participantRequest ) return;
        const newParticipantRequest = { ...participantRequest, [key]: value };
        if ( key === "approve" ) {
            newParticipantRequest.approveFilename = (value as File).name;
        }
        setParticipantRequest( newParticipantRequest );
    };

    const setParticipantRequestPlayerKills = ( i: number, j: number, value: number ) => {
        setParticipantRequest( ( prevState ) => {
            if ( !prevState ) return prevState;
            const dataArray = [ ...prevState.dataArray ];
            dataArray[j][i] = value;
            return { ...prevState, dataArray };
        } );
    };

    const setParticipantRequestPlaces = ( i: number, item: 0 | 1, value: number ) => {
        if ( !participantRequest ) return;
        const newParticipantRequest = { ...participantRequest };
        newParticipantRequest.places[i][item] = value;
        setParticipantRequest( newParticipantRequest );
    };

    const setRequestRoundsHidden = ( index: number, i: number ) => {
        if ( !participantRequest ) return;
        const newParticipantRequest = { ...participantRequest };
        if ( newParticipantRequest.isRoundsHidden.length !== AMOUNT_ROUNDS ) {
            newParticipantRequest.isRoundsHidden = DEFAULT_ROUNDS_HIDDEN;
        }
        newParticipantRequest.isRoundsHidden[i] = !newParticipantRequest.isRoundsHidden[i];
        setParticipantRequest( newParticipantRequest );
    };

    const saveHandler = async (): Promise<IParticipantRequest | string> => {
        try {
            const { participantRequest: updatedParticipantRequest } = await request(
                `/api/tournament/create-participant-request`, "POST", parseFormData( participantRequest ?? {} ), {
                    Authorization: `Bearer ${ token }`
                }, false ) as { participantRequest: IParticipantRequest, isOk: boolean };
            return updatedParticipantRequest;
        } catch ( e ) {
            if ( e && (e as { message: string }).message !== undefined ) {
                return (e as { message: string }).message;
            }
            return "Internal error";
        }
    };

    return {
        setParticipantRequestPlayerKills,
        setParticipantRequestPlaces,
        setRequestRoundsHidden,
        participantRequest,
        participant,
        changeParticipantRequestField,
        loading,
        pIndex,
        saveHandler
    };
};

export const participantHooks = (
    request: Function,
    participants: Array<IParticipant>,
    setParticipants: Dispatch<Array<IParticipant>>,
    manualRefetch: () => void,
    setMessageOptions: Dispatch<IMessageOptions>,
    setIsEditActive: Dispatch<boolean>,
    token: null | string
) => {
    const unregisterParticipant = async ( participantId: number ) => {
        const { isOk } = await request( `/api/tournament/unregister`, "POST", { participantId }, {
            Authorization: `Bearer ${ token }`
        }, true );
        if ( isOk ) {
            setParticipants( participants.filter( ptsp => (ptsp.id !== participantId) ) );
        }
        return isOk;
    };

    const changePayStatus = async ( participantId: number ) => {
        const { isOk } = await request( `/api/tournament/change-pay-status`, "POST", { participantId }, {
            Authorization: `Bearer ${ token }`
        }, true );
        if ( isOk ) {
            setParticipants( participants.map( ptsp => (
                ptsp.id === participantId ?
                    { ...ptsp, isPaid: !ptsp.isPaid } :
                    ptsp
            ) ) );
        }
        return isOk;
    };

    const saveHandler = async () => {
        try {
            const { isOk, message }: { isOk: boolean, message: string } = await request(
                "/api/tournament/edit-register",
                "POST",
                {
                    participants: participants.map( p => ({
                        dataArray: p.dataArray, places: p.places, id: p.id, players: p.users.length,
                        isRoundsHidden: p.isRoundsHidden
                    }) )
                },
                {
                    Authorization: `Bearer ${ token }`
                }, true );
            setMessageOptions( {
                status: isOk ? "pos" : "neg", text: message
            } );
            if ( isOk ) {
                manualRefetch();
                setIsEditActive( false );
            }
        } catch ( e ) {
            console.log( e );
        }
    };

    const redeclareRoomNumber = async ( participantId: number ) => {
        try {
            const { isOk }: { isOk: boolean, message: string } = await request(
                "/api/tournament/redeclare-room",
                "POST",
                { participantId },
                {
                    Authorization: `Bearer ${ token }`
                }, true );
            if ( isOk ) {
                manualRefetch();
            }
        } catch ( e ) {
            console.log( e );
        }
    };
    const increasePriority = async ( participantId: number ) => {
        try {
            const { isOk }: { isOk: boolean, message: string } = await request(
                "/api/tournament/increase-priority",
                "POST",
                { participantId },
                {
                    Authorization: `Bearer ${ token }`
                }, true );
            if ( isOk ) {
                manualRefetch();
            }
        } catch ( e ) {
            console.log( e );
        }
    };
    return {
        unregisterParticipant,
        changePayStatus,
        saveHandler,
        redeclareRoomNumber,
        increasePriority
    };
};

export const useAdminPlayerRequest = ( participant: IParticipant, token: string | null ) => {
    const [ error, setError ] = useState( "" );
    const { request, loading } = useHttp();

    const approveRequest = async (): Promise<boolean> => {
        try {
            const { isOk } = await request(
                "/api/tournament/change-participant-request-status",
                "POST",
                { participantRequestId: participant.participant_request.id, status: "approved" },
                {
                    Authorization: `Bearer ${ token }`
                }, true );
            return isOk;
        } catch ( e ) {
            if ( e && (e as { message: string }).message !== undefined ) {
                setError( (e as { message: string }).message );
            }
            setError( "Internal error" );
            return false;
        }
    };
    const discardRequest = async (): Promise<boolean> => {
        try {
            const { isOk }: { isOk: boolean, message: string } = await request(
                "/api/tournament/change-participant-request-status",
                "POST",
                { participantRequestId: participant.participant_request.id, status: "discarded" },
                {
                    Authorization: `Bearer ${ token }`
                }, true );
            return isOk;
        } catch ( e ) {
            if ( e && (e as { message: string }).message !== undefined ) {
                setError( (e as { message: string }).message );
            }
            setError( "Internal error" );
            return false;
        }
    };

    return {
        error,
        loading,
        approveRequest,
        discardRequest
    };
};
