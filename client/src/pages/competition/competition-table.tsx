import React, { FC } from "react";
import UserSearchDropdown from "../../components/user/user-search-dropdown";
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
                        { participantRow.map( ( _, index ) => (
                            <div key={ index } style={ {
                                paddingBottom: `${ index < participantRow.length - 1 ?
                                    ((2 ** (rowIndex - 1) - 1) * 40 +
                                        (2 ** (rowIndex - 1) - 1) * 8) : 0 }px`
                            } }>
                                <div className="tournament-table__separator" style={ {
                                    height: `${ 88 + ((2 ** (rowIndex - 1) - 1) * 40 +
                                        (2 ** (rowIndex - 1) - 1) * 8) }px`
                                } }/>
                            </div>
                        ) ) }
                    </div> }
                    <div className="tournament-table__row" key={ rowIndex }>
                        { participantRow.map( ( participantItem, index ) => (
                            <div key={ participantItem ? participantItem.id : `index-${ index }` } style={ {
                                marginTop: `${ rowIndex !== 0 ?
                                    ((2 ** rowIndex - 1) * 40 + (2 ** rowIndex - 1) * 8) /
                                    (index === 0 ? 2 : 1) + (index === 0 ? 0 : 8) :
                                    0 }px`
                            } }>
                                <UserSearchDropdown
                                    onSelect={ ( user ) => setValue( user, rowIndex,
                                        index ) }
                                    variant={ "compact" }
                                    initialUser={participantItem}
                                    { ...(rowIndex > 0 ? {
                                        options: [ data[rowIndex - 1][2 * index],
                                            data[rowIndex - 1][2 * index + 1] ]
                                    } : {}) }

                                />
                            </div>
                        ) ) }
                    </div>
                </React.Fragment>
            ) ) }
        </div>
    );
};

export default CompetitionTable;
