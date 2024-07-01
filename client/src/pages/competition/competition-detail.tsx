import React, { FC, useContext } from "react";
import { NavLink } from "react-router-dom";
import StateSelect from "../../components/base/StateSelect";
import { AuthContext } from "../../context/AuthContext";
import { COMPETITION_PARTICIPANT_AMOUNT_OPTIONS } from "../../hooks/competition";
import { usePostPutOneCompetition } from "../../hooks/competition/post-put-one";
import { __ } from "../../multilang/Multilang";
import CompetitionTable from "./competition-table";
import { CompetitionDetailProps } from "./types";

const CompetitionDetail: FC<CompetitionDetailProps> = ( { competition } ) => {
    const {
        data, setTitle, setParticipantsAmount, setParticipant, setOutsider, toggleIsOutsiders, messageOptions, save,
        isEdit, setIsEdit
    } = usePostPutOneCompetition( competition );

    const { user } = useContext( AuthContext );

    return (
        <div className="side__container">
            <NavLink to="/competition" className="build__back">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                     fill="none">
                    <path
                        d="M15.832 9.99933H4.16532M4.16532 9.99933L9.99872 4.16602M4.16532 9.99933L9.99872 15.8327"
                        stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                { __( "Назад" ) }
            </NavLink>
            { isEdit &&
                <h1 className="side__title">{ data.id ? __( "Редатировать турнир" ) : __( "Создать турнир" ) }</h1> }
            { !isEdit && <h1 className="side__title pb32">{ data.title }</h1> }
            { isEdit && <div className="build__data-block">
                <p className="build__label">{ __( "Название" ) }</p>
                <label htmlFor="title" className="input-both">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder={ __( "Название" ) }
                        value={ data.title }
                        onChange={ ( e: React.FormEvent<HTMLInputElement> ) => {
                            setTitle( e.currentTarget.value );
                        } }
                    />
                </label>
            </div> }
            { isEdit && <div className="build__data-block">
                <p className="build__label">{ __( "Общая информация" ) }</p>
                <StateSelect
                    options={ COMPETITION_PARTICIPANT_AMOUNT_OPTIONS }
                    setValue={ ( val ) => {
                        setParticipantsAmount( val );
                    } }
                    text={ data.participantsAmount ? `${ data.participantsAmount }` : "Выберите" +
                        " количество участников" }
                />
            </div> }
            { isEdit && <div className="build__data-block">
                <p className="build__label">{ __( "Утешительные матчи" ) }</p>
                <label className={ data.isOutsiders ? "admin__checkbox active" : "admin__checkbox" }
                       onClick={ toggleIsOutsiders }>
                    <span className="admin__checkbox-rect"></span>
                    <span className="admin__checkbox-label">{ __( data.isOutsiders ? "Выключить" : "Включить" ) }</span>
                </label>
            </div> }
            { data.participantsAmount !== 0 && <div className="build__data-block">
                <p className="build__label">{ __( "Турнирная таблица" ) }</p>
                <CompetitionTable data={ data.participantsUsers } setValue={ setParticipant } isEdit={isEdit}/>
            </div> }
            { data.isOutsiders && data.participantsAmount !== 0 && <div className="build__data-block">
                <p className="build__label">{ __( "Утешительные матчи" ) }</p>
                <CompetitionTable data={ data.outsidersUsers } setValue={ setOutsider } isEdit={isEdit}/>
            </div> }
            { messageOptions.text &&
                <div className={ `${ messageOptions.status }-message mb24` }>{ __( messageOptions.text ) }</div> }
            { isEdit && <div className="pt12 pb64 popup__buttons">
                <button className="button-both-accent corner-margin" onClick={ save }>{ __( "Сохранить" ) }</button>
                { !!competition &&
                    <button className="button-both-gray corner-margin" onClick={ () => window.location.reload() }>{ __(
                        "Отменить" ) }</button> }
            </div> }
            { !isEdit && !!user && user.id === data.authorId && <div className="pt12 pb64 popup__buttons">
                <button className="button-both-accent corner-margin" onClick={ () => setIsEdit( true ) }>{ __(
                    "Редактировать" ) }</button>
            </div> }
        </div>
    );
};

export default CompetitionDetail;
