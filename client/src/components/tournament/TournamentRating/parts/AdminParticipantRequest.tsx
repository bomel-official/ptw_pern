import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { getFile } from "../../../../functions/getFile";
import { __ } from "../../../../multilang/Multilang";
import { IMessageOptions, IParticipant } from "../../../../StoreTypes";
import Loader from "../../../base/Loader";
import { Popup } from "../../../base/Popup";
import { useAdminPlayerRequest } from "../hooks";

export const AdminParticipantRequest = ( {
    participant, isActive, onHide, manualRefetch,
}: { participant: IParticipant, isActive: boolean, onHide: () => void, manualRefetch: () => void } ) => {
    const participantRequest = participant.participant_request;
    const { token } = useContext( AuthContext );

    const { loading, error, discardRequest, approveRequest } = useAdminPlayerRequest( participant, token );
    const [ messageOptions, setMessageOptions ] = useState<IMessageOptions>( { status: "", text: "" } );

    useEffect( () => {
        if ( error ) {
            setMessageOptions( { status: "neg", text: error } );
        }
    }, [ error ] );

    if ( !participant || !participantRequest ) {
        return null;
    }

    const resolve = async ( action: () => Promise<boolean> ) => {
        const isOk = await action();
        if ( isOk ) {
            manualRefetch();
            onHide();
        }
    };

    return (
        <Popup isActive={ isActive } onHide={ onHide } title={ "Подтвержение результатов" } width="1280px"
               height="calc(100% - 30px)" overflow="auto">
            <div className="image-wrapper mt24" style={ { flexGrow: 1 } }>
                <img src={ getFile( participantRequest.approveUrl ) } alt="Approve" style={ {
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center"
                } }/>
            </div>
            { messageOptions.text &&
                <div className={ `${ messageOptions.status }-message mt24` }>{ __( messageOptions.text ) }</div> }
            { loading ? <Loader/> : <div className="popup__buttons pt24">
                <button className="button-br-accent corner-margin" onClick={ () => resolve( approveRequest ) }>
                    { __( "Подтвердить" ) }
                </button>
                <button className="button-both-gray corner-margin" onClick={ () => resolve( discardRequest ) }>
                    { __( "Отклонить" ) }
                </button>
            </div> }
        </Popup>
    );
};
