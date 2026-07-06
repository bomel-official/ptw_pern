import { Dispatch, useEffect, useState } from "react";
import { useHttp } from "../../../hooks/http.hook/http-hook";
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
import { AMOUNT_ROUNDS, createRoundsHidden } from "./rating-constants";
import { setMatrixCell, setPlacesCell, toggleRoundHidden } from "./rating-helpers";

type RequestFn = <TResponse = any>(
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
    headers?: Record<string, string>,
    isJson?: boolean,
) => Promise<TResponse>;

const errorMessage = ( e: unknown, fallback = "Internal error" ): string =>
    (e && typeof e === "object" && typeof (e as { message?: unknown }).message === "string")
        ? (e as { message: string }).message
        : fallback;

export const useParticipants = ( tournament: ITournament | null, type?: "users" | "rating", refetch?: boolean ) => {
    const [ participants, setParticipants ] = useState<Array<IParticipant>>( [] );
    const [ manualRefetchState, setManualRefetchState ] = useState( false );
    const { request, loading } = useHttp();

    const tournamentId = tournament?.id ?? null;

    const fetchParticipants = async () => {
        if ( tournamentId ) {
            const { participants: fetchedParticipants } = await request(
                `/api/tournament/get-participants?tournamentId=${ tournamentId }&type=${ type || "" }`, "GET" );
            setParticipants( fetchedParticipants );
        }
    };

    const manualRefetch = () => {
        setManualRefetchState( ( prev ) => !prev );
    };

    useEffect( () => {
        fetchParticipants().catch( () => {} );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ tournamentId, type, refetch, manualRefetchState ] );

    const changeCertainParticipant = ( index: number, value: IParticipant ) => {
        setParticipants( ( ptsps ) => ptsps.map( ( ptsp, i ) => (i === index ? value : ptsp) ) );
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
        const index = participants.findIndex( ( ptsp ) => isUserInParticipant( ptsp, user ) );
        const found = index === -1 ? undefined : participants[index];

        if ( found && user && !participantRequest ) {
            setPIndex( index );

            const dataArray = found.users.map( () => Array( AMOUNT_ROUNDS ).fill( 0 ) as number[] );
            const places = Array.from( { length: AMOUNT_ROUNDS }, () => [ -1, 0 ] as [ number, number ] );

            setParticipantRequest( {
                participantId: found.id,
                isRoundsHidden: createRoundsHidden(),
                dataArray,
                places,
                approve: null,
                approveFilename: "",
            } );
            setParticipant( found );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ participants, user ] );

    const changeParticipantRequestField = <TKey extends keyof IParticipantRequestDTO>( key: TKey,
                                                                                       value: IParticipantRequestDTO[TKey] ) => {
        setParticipantRequest( ( prev ) => {
            if ( !prev ) return prev;
            const next = { ...prev, [key]: value };
            if ( key === "approve" ) {
                next.approveFilename = value ? (value as File).name : "";
            }
            return next;
        } );
    };

    const setParticipantRequestPlayerKills = ( i: number, j: number, value: number ) => {
        setParticipantRequest( ( prev ) =>
            prev ? { ...prev, dataArray: setMatrixCell( prev.dataArray, j, i, value ) } : prev );
    };

    const setParticipantRequestPlaces = ( i: number, item: 0 | 1, value: number ) => {
        setParticipantRequest( ( prev ) =>
            prev ? { ...prev, places: setPlacesCell( prev.places, i, item, value ) } : prev );
    };

    const setRequestRoundsHidden = ( i: number ) => {
        setParticipantRequest( ( prev ) =>
            prev ? { ...prev, isRoundsHidden: toggleRoundHidden( prev.isRoundsHidden, i ) } : prev );
    };

    const saveHandler = async (): Promise<IParticipantRequest | string> => {
        try {
            const { participantRequest: updatedParticipantRequest }: {
                participantRequest: IParticipantRequest, isOk: boolean
            } = await request(
                `/api/tournament/create-participant-request`, "POST", parseFormData( participantRequest ?? {} ), {
                    Authorization: `Bearer ${ token }`
                }, false );
            return updatedParticipantRequest;
        } catch ( e ) {
            return errorMessage( e );
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
    request: RequestFn,
    participants: Array<IParticipant>,
    setParticipants: Dispatch<Array<IParticipant>>,
    manualRefetch: () => void,
    setMessageOptions: Dispatch<IMessageOptions>,
    setIsEditActive: Dispatch<boolean>,
    token: null | string
) => {
    const authHeaders = { Authorization: `Bearer ${ token }` };

    const unregisterParticipant = async ( participantId: number ) => {
        const { isOk } = await request<{ isOk: boolean }>(
            `/api/tournament/unregister`, "POST", { participantId }, authHeaders, true );
        if ( isOk ) {
            setParticipants( participants.filter( ( ptsp ) => ptsp.id !== participantId ) );
        }
        return isOk;
    };

    const changePayStatus = async ( participantId: number ) => {
        const { isOk } = await request<{ isOk: boolean }>(
            `/api/tournament/change-pay-status`, "POST", { participantId }, authHeaders, true );
        if ( isOk ) {
            setParticipants( participants.map( ( ptsp ) => (
                ptsp.id === participantId ? { ...ptsp, isPaid: !ptsp.isPaid } : ptsp
            ) ) );
        }
        return isOk;
    };

    const saveHandler = async () => {
        try {
            const { isOk, message } = await request<{ isOk: boolean, message: string }>(
                "/api/tournament/edit-register",
                "POST",
                {
                    participants: participants.map( ( p ) => ({
                        dataArray: p.dataArray, places: p.places, id: p.id, players: p.users.length,
                        isRoundsHidden: p.isRoundsHidden
                    }) )
                },
                authHeaders, true );
            setMessageOptions( { status: isOk ? "pos" : "neg", text: message } );
            if ( isOk ) {
                manualRefetch();
                setIsEditActive( false );
            }
        } catch ( e ) {
            setMessageOptions( { status: "neg", text: errorMessage( e ) } );
        }
    };

    const redeclareRoomNumber = async ( participantId: number ) => {
        const { isOk } = await request<{ isOk: boolean, message: string }>(
            "/api/tournament/redeclare-room", "POST", { participantId }, authHeaders, true );
        if ( isOk ) {
            manualRefetch();
        }
    };

    const increasePriority = async ( participantId: number ) => {
        const { isOk } = await request<{ isOk: boolean, message: string }>(
            "/api/tournament/increase-priority", "POST", { participantId }, authHeaders, true );
        if ( isOk ) {
            manualRefetch();
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

    const changeStatus = async ( status: "approved" | "discarded" ): Promise<boolean> => {
        try {
            const { isOk }: { isOk: boolean } = await request(
                "/api/tournament/change-participant-request-status",
                "POST",
                { participantRequestId: participant.participant_request.id, status },
                { Authorization: `Bearer ${ token }` }, true );
            return isOk;
        } catch ( e ) {
            setError( errorMessage( e ) );
            return false;
        }
    };

    return {
        error,
        loading,
        approveRequest: () => changeStatus( "approved" ),
        discardRequest: () => changeStatus( "discarded" )
    };
};
