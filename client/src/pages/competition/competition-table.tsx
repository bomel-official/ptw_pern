import React, { FC } from "react";
import CompetitionItemCard from "../../components/competition/competition-item";
import CompetitionItemSelect from "../../components/competition/competition-item-select";
import { CompetitionTableProps } from "./types";

const CompetitionTable: FC<CompetitionTableProps> = ( { data, setValue } ) => {
    return (
        <div className="tournament-table">
            { data.map( ( participantRow, rowIndex ) => (
                <React.Fragment key={ rowIndex }>
                    { rowIndex > 0 && <div className="tournament-table__separator-row" style={ {
                        marginTop: `${ (
                            (2 ** (rowIndex - 1) - 1) * 40 + (2 ** (rowIndex - 1) - 1) * 8
                        ) / 2 }px`
                    } }>
                        { participantRow.map( ( _, index ) => {
                            const prevItems = rowIndex > 0 ?
                                [ data[rowIndex - 1][index * 2], data[rowIndex - 1][index * 2 + 1] ].filter(
                                    option => option !== undefined
                                ) : [];
                            return (
                                <div key={ index } style={ {
                                    paddingBottom: `${ index < participantRow.length - 1 ?
                                        ((2 ** (rowIndex - 1) - 1) * 40 +
                                            (2 ** (rowIndex - 1) - 1) * 8) : 0 }px`
                                } }>
                                    <div className={ `tournament-table__separator ${
                                        prevItems.length === 0 ?
                                            `hidden` :
                                            prevItems.length === 1 ?
                                                `top-only` :
                                                ""
                                    }` } style={ {
                                        height: `${ 88 + ((2 ** (rowIndex - 1) - 1) * 40 +
                                            (2 ** (rowIndex - 1) - 1) * 8) }px`
                                    } }/>
                                </div>
                            );
                        } ) }
                    </div> }
                    <div className="tournament-table__row" key={ rowIndex }>
                        { participantRow.map( ( participantItem, index ) => {
                            const opponent = index % 2 === 0
                                ? participantRow[index + 1]
                                : participantRow[index - 1];
                            const isWinner = (opponent?.points ?? -1) < participantItem.points;
                            const isEqual = (opponent?.points ?? 0) === participantItem.points;
                            const prevItems = rowIndex > 0 ?
                                [ data[rowIndex - 1][index * 2], data[rowIndex - 1][index * 2 + 1] ].filter(
                                    option => option !== undefined && option.index !== -1
                                ) : [];

                            return <div
                                key={ index }
                                style={ {
                                    marginTop: `${ rowIndex !== 0 ?
                                        ((2 ** rowIndex - 1) * 40 + (2 ** rowIndex - 1) * 8) /
                                        (index === 0 ? 2 : 1) + (index === 0 ? 0 : 8) :
                                        0 }px`,
                                    minWidth: `220px`
                                } }
                            >
                                { participantItem.index === -1 && rowIndex > 0 && isEqual ? <CompetitionItemSelect
                                    setItem={ ( item ) => setValue ? setValue( item, rowIndex, index ) : null }
                                    options={ prevItems }
                                /> : <label
                                    className="dropdown__current compact"
                                    style={ { marginBottom: "8px" } }
                                >
                                    <CompetitionItemCard
                                        item={ participantItem }
                                        setItem={ setValue ? (( item ) => setValue ?
                                            setValue( item, rowIndex, index ) : null) : null }
                                        isWinner={ isWinner }
                                        isNoPoints={ rowIndex === data.length - 1 }
                                        showClear={ !(
                                            (rowIndex === 0 || !setValue) ||
                                            (prevItems.length === 2 && prevItems[0].points !== prevItems[1].points) ||
                                            (prevItems.length === 0)
                                        ) }
                                        isLink={ !setValue }
                                    />
                                </label> }
                            </div>;
                        } ) }
                    </div>
                </React.Fragment>
            ) ) }
        </div>
    );
};

export default CompetitionTable;
