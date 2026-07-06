import React, { Dispatch } from "react";
import { isUserAdmin } from "../../../../functions/isUserAdmin";
import { __ } from "../../../../multilang/Multilang";
import { IUser } from "../../../../StoreTypes";
import Loader from "../../../base/Loader";

export const useTournamentRatingButtons = (
    isEditActive: boolean,
    setIsEditActive: Dispatch<boolean>,
    user: IUser | null,
    loading: boolean,
    { saveHandler }: { saveHandler: () => void },
) => {
    const isAdmin = isUserAdmin( user );

    const editButton = isAdmin && !isEditActive && (
        <button className="button-both-accent mb8 corner-margin" onClick={ () => setIsEditActive( true ) }>
            <span>{ __( "Редактировать" ) }</span>
        </button>
    );

    const saveOrDiscardButton = isAdmin && isEditActive && (
        <div className="flex pt12 pb12" style={ { gap: "8px" } }>
            { !loading && <>
                <button className="button-tl-accent mb8 corner-margin" onClick={ saveHandler }>
                    <span>{ __( "Сохранить" ) }</span>
                </button>
                <button className="button-br-gray mb8 corner-margin" onClick={ () => setIsEditActive( false ) }>
                    <span>{ __( "Отмена" ) }</span>
                </button>
            </> }
            { loading && <Loader/> }
        </div>
    );

    return { editButton, saveOrDiscardButton };
};
