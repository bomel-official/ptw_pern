import React, { FC, useContext } from "react";
import { NavLink } from "react-router-dom";
import StateSelect from "../../components/base/StateSelect";
import CompetitionItemSearch from "../../components/competition/competition-item-search";
import CompetitionItems from "../../components/competition/competition-items";
import { AuthContext } from "../../context/AuthContext";
import { COMPETITION_TYPE_OPTIONS } from "../../hooks/competition";
import { usePostPutOneCompetition } from "../../hooks/competition/post-put-one";
import { __ } from "../../multilang/Multilang";
import CompetitionTable from "./competition-table";
import { CompetitionDetailProps } from "./types";

const CompetitionDetail: FC<CompetitionDetailProps> = ( { competition } ) => {
    const {
        data, setTitle, toggleIsOutsiders, messageOptions, save, setParticipant, setOutsider,
        isEdit, setIsEdit, addItem, removeItem, toggleAllowShuffle, setParticipantType, items, setItemsInTeam, shuffle
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
            { isEdit ? <>
                <h1 className="side__title">{ data.id ? __( "Редатировать турнир" ) : __( "Создать турнир" ) }</h1>
                <div className="build__data-block">
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
                </div>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Участники" ) }</p>
                    <div className="build__grid-row">
                        <label
                            className={ data.competitionTable.allowShuffle ? "admin__checkbox active" :
                                "admin__checkbox" }
                            onClick={ toggleAllowShuffle }
                        >
                            <span className="admin__checkbox-rect"></span>
                            <span className="admin__checkbox-label">{ __(
                                data.competitionTable.allowShuffle ? "Выключить перемешивание" :
                                    "Включить перемешивание" ) }</span>
                        </label>
                        { data.competitionTable.allowShuffle ? <button
                            className="button-both-accent corner-margin"
                            onClick={ shuffle }
                        >
                            { __( "Перемешать" ) }
                        </button> : <div></div> }
                    </div>
                    { data.competitionTable.allowShuffle && <>
                        <div className="build__grid-row">
                            <StateSelect
                                options={ COMPETITION_TYPE_OPTIONS.filter(
                                    ( option ) => option.value !== data.competitionTable.type ) }
                                setValue={ ( val ) => {
                                    setParticipantType( val );
                                } }
                                text={ COMPETITION_TYPE_OPTIONS.find( ( option ) => (
                                    option.value === data.competitionTable.type
                                ) )?.text || "Выберите тип участников" }
                            />
                            <CompetitionItemSearch
                                type={ data.competitionTable.type }
                                onSelect={ addItem }
                                exclude={ {
                                    users: data.competitionTable.users, teams: data.competitionTable.teams
                                } }
                            />
                        </div>

                        { data.competitionTable.type === "user" && <>
                            <p className="build__label pt12">{ __( "Участников в команде" ) }</p>
                            <label htmlFor="itemsInTeam" className="input-both mb12">
                                <input
                                    type="number"
                                    name="itemsInTeam"
                                    id="itemsInTeam"
                                    placeholder={ __( "Участников в команде" ) }
                                    value={ data.competitionTable.itemsInTeam }
                                    onChange={ ( e: React.FormEvent<HTMLInputElement> ) => {
                                        setItemsInTeam( parseInt( e.currentTarget.value ) );
                                    } }
                                />
                            </label>
                        </> }
                    </> }
                    <CompetitionItems
                        type={ data.competitionTable.type }
                        teams={ data.competitionTable.teams }
                        users={ data.competitionTable.users }
                        onDelete={ data.competitionTable.allowShuffle ? removeItem : null }
                    />
                    <p className="build__label">
                        { __( "Участников:" ) } { items.length }
                    </p>
                </div>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Турнирная таблица" ) }</p>
                    <CompetitionTable
                        data={ data.competitionTable.participantsUsers }
                        setValue={ setParticipant }
                    />
                </div>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Утешительные матчи" ) }</p>
                    <label
                        className={ data.competitionTable.isOutsiders ? "admin__checkbox active" :
                            "admin__checkbox" }
                        onClick={ toggleIsOutsiders }
                    >
                        <span className="admin__checkbox-rect"></span>
                        <span className="admin__checkbox-label">{ __(
                            data.competitionTable.isOutsiders ? "Скрыть утешительные матчи" :
                                "Показать утешительные матчи" ) }</span>
                    </label>
                    { data.competitionTable.isOutsiders && <CompetitionTable
                        data={ data.competitionTable.outsidersUsers }
                        setValue={ setOutsider }
                    /> }
                </div>
                { messageOptions.text &&
                    <div className={ `${ messageOptions.status }-message mb24` }>{ __( messageOptions.text ) }</div> }
                <div className="pt12 pb64 popup__buttons">
                    <button className="button-both-accent corner-margin" onClick={ save }>{ __( "Сохранить" ) }</button>
                    { !!competition && <button
                        className="button-both-gray corner-margin"
                        onClick={ () => window.location.reload() }
                    >
                        { __( "Отменить" ) }
                    </button> }
                </div>
            </> : <>
                <h1 className="side__title pb32">{ data.title }</h1>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Турнирная таблица" ) }</p>
                    <CompetitionTable
                        data={ data.competitionTable.participantsUsers }
                        setValue={ null }
                    />
                </div>
                { data.competitionTable.isOutsiders && <div className="build__data-block">
                    <p className="build__label">{ __( "Утешительные матчи" ) }</p>
                    <CompetitionTable
                        data={ data.competitionTable.outsidersUsers }
                        setValue={ null }
                    />
                </div> }
                { !!user && user.id === data.authorId && <div className="pt12 pb64 popup__buttons">
                    <button
                        className="button-both-accent corner-margin"
                        onClick={ () => setIsEdit( true ) }
                    >
                        { __( "Редактировать" ) }
                    </button>
                </div> }
            </> }
        </div>
    );
};

export default CompetitionDetail;
