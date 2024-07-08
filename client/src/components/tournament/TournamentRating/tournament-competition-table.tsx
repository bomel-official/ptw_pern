import React, { FC, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { isUserAdmin } from "../../../functions/isUserAdmin";
import { useRatingTable } from "../../../hooks/tournament";
import { __ } from "../../../multilang/Multilang";
import CompetitionTable from "../../../pages/competition/competition-table";
import CompetitionItems from "../../competition/competition-items";
import { TournamentCompetitionTableProps } from "./types";

const TournamentCompetitionTable: FC<TournamentCompetitionTableProps> = ( { tournament } ) => {
    const {
        toggleIsOutsiders, setOutsider, shuffle, setParticipant, toggleAllowShuffle, save, table, isEdit, setIsEdit, messageOptions
    } = useRatingTable( tournament );

    const { user } = useContext( AuthContext );

    return (
        <div>
            { isEdit ? <>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Участники" ) }</p>
                    <div className="build__grid-row">
                        <label
                            className={ table.allowShuffle ? "admin__checkbox active" :
                                "admin__checkbox" }
                            onClick={ toggleAllowShuffle }
                        >
                            <span className="admin__checkbox-rect"></span>
                            <span className="admin__checkbox-label">{ __(
                                table.allowShuffle ? "Выключить перемешивание" :
                                    "Включить перемешивание" ) }</span>
                        </label>
                        { table.allowShuffle ? <button
                            className="button-both-accent corner-margin"
                            onClick={ shuffle }
                        >
                            { __( "Перемешать" ) }
                        </button> : <div></div> }
                    </div>
                    <CompetitionItems
                        type={ table.type }
                        teams={ table.teams }
                        users={ table.users }
                        onDelete={ null }
                    />
                    <p className="build__label">
                        { __( "Участников:" ) } { table.teams.length }
                    </p>
                </div>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Турнирная таблица" ) }</p>
                    <CompetitionTable
                        data={ table.participantsUsers }
                        setValue={ setParticipant }
                    />
                </div>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Утешительные матчи" ) }</p>
                    <label
                        className={ table.isOutsiders ? "admin__checkbox active" :
                            "admin__checkbox" }
                        onClick={ toggleIsOutsiders }
                    >
                        <span className="admin__checkbox-rect"></span>
                        <span className="admin__checkbox-label">{ __(
                            table.isOutsiders ? "Скрыть утешительные матчи" :
                                "Показать утешительные матчи" ) }</span>
                    </label>
                    { table.isOutsiders && <CompetitionTable
                        data={ table.outsidersUsers }
                        setValue={ setOutsider }
                    /> }
                </div>
                { messageOptions.text &&
                    <div className={ `${ messageOptions.status }-message mb24` }>{ __( messageOptions.text ) }</div> }
                <div className="pt12 pb64 popup__buttons">
                    <button className="button-both-accent corner-margin" onClick={ save }>{ __( "Сохранить" ) }</button>
                    <button
                        className="button-both-gray corner-margin"
                        onClick={ () => window.location.reload() }
                    >
                        { __( "Отменить" ) }
                    </button>
                </div>
            </> : <>
                <div className="build__data-block">
                    <p className="build__label">{ __( "Турнирная таблица" ) }</p>
                    <CompetitionTable
                        data={ table.participantsUsers }
                        setValue={ null }
                    />
                </div>
                { table.isOutsiders && <div className="build__data-block">
                    <p className="build__label">{ __( "Утешительные матчи" ) }</p>
                    <CompetitionTable
                        data={ table.outsidersUsers }
                        setValue={ null }
                    />
                </div> }
                { isUserAdmin( user ) && <div className="pt12 pb64 popup__buttons">
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

export default TournamentCompetitionTable;
