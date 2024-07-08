import { isTeam } from "../../guards";
import {
    Competition,
    CompetitionDTORequest,
    CompetitionParticipant,
    CompetitionTable,
    CompetitionTableDTO,
    CompetitionTableDTORequest,
    IUser,
    Team
} from "../../StoreTypes";
import { COMPETITION_ITEM_NUMBER_DEFAULT } from "../competition";
import { generateTeams } from "../competition/libs";
import { useTypedHttp } from "../http.hook";
import { ResponseData } from "../types";

export function usePostPutOneCompetitionTable(
    setTable: ( dispatch: ( prevState: CompetitionTableDTO ) => CompetitionTableDTO ) => void,
) {
    function setParticipantType( type: CompetitionTable["type"] ) {
        setTable( ( prevState ) => ({ ...prevState, type, itemsInTeam: 1 }) );
    }

    function toggleIsOutsiders() {
        setTable( ( prevState ) => ({ ...prevState, isOutsiders: !prevState.isOutsiders }) );
    }

    function toggleAllowShuffle() {
        setTable( ( prevState ) => ({ ...prevState, allowShuffle: !prevState.allowShuffle }) );
    }

    function setParticipantsAmount( table: CompetitionTableDTO ): CompetitionTableDTO {
        const newItems = table.type === "user"
            ? table.users
            : table.teams;

        if ( newItems.length % table.itemsInTeam !== 0 ) {
            return table;
        }

        const cellAmount = Math.round( 2 ** (Math.ceil( Math.log( newItems.length ) / Math.log( 2 ) )) /
            table.itemsInTeam );

        const newParticipantsUsers: CompetitionTableDTO["participantsUsers"] = [];
        const newOutsidersUsers: CompetitionTableDTO["outsidersUsers"] = [];

        for ( let power = 0; 2 ** power <= cellAmount; power++ ) {
            const arrayLength = Math.round( cellAmount / (2 ** power) );

            newParticipantsUsers[power] = Array( arrayLength ).fill( COMPETITION_ITEM_NUMBER_DEFAULT );

            if ( power === 0 ) {
                newOutsidersUsers[power] =
                    Array( Math.round( arrayLength / 2 ) ).fill( COMPETITION_ITEM_NUMBER_DEFAULT );
            } else if ( newOutsidersUsers[power - 1].length > 1 ) {
                newOutsidersUsers[power] =
                    Array(
                        Math.round( (newOutsidersUsers[power - 1].length + (arrayLength <= 2 ? 0 : arrayLength)) / 2 ) )
                        .fill( COMPETITION_ITEM_NUMBER_DEFAULT );
            }
        }

        while ( newOutsidersUsers.length > 0 && newOutsidersUsers[newOutsidersUsers.length - 1].length !== 1 ) {
            newOutsidersUsers.push( Array( Math.round( (newOutsidersUsers[newOutsidersUsers.length - 1].length) / 2 ) )
                .fill( COMPETITION_ITEM_NUMBER_DEFAULT ) );
        }

        const { participantsUsersRow } = generateTeams( newItems, table.itemsInTeam, cellAmount );
        newParticipantsUsers[0] = participantsUsersRow;

        return {
            ...table,
            participantsUsers: newParticipantsUsers,
            outsidersUsers: newOutsidersUsers
        };
    }

    function shuffle() {
        setTable( ( prevState ) => setParticipantsAmount( prevState ) );
    }

    function setItemsInTeam( itemsInTeam: number ) {
        setTable( ( prevState ) => setParticipantsAmount( {
            ...prevState, itemsInTeam
        } ) );
    }

    function addItem( item: IUser | Team ) {
        if ( isTeam( item ) ) {
            setTable( ( prevState ) => setParticipantsAmount( {
                ...prevState, teams: [ ...prevState.teams, item ]
            } ) );
        } else {
            setTable( ( prevState ) => setParticipantsAmount( {
                ...prevState, users: [ ...prevState.users, item ]
            } ) );
        }
    }

    function removeItem( item: IUser | Team ) {
        if ( isTeam( item ) ) {
            setTable( ( prevState ) => setParticipantsAmount( {
                ...prevState,
                teams: prevState.teams.filter( ( _team ) => _team.id !== item.id )
            } ) );
        } else {
            setTable( ( prevState ) => setParticipantsAmount( {
                ...prevState,
                users: prevState.users.filter( ( _user ) => _user.id !== item.id )
            } ) );
        }
    }

    function setParticipant( newItem: CompetitionParticipant<Team | IUser>, rowIndex: number, index: number ) {
        setTable( ( prevState ) => {
            const table = { ...prevState };
            const opponent = index % 2 === 0
                ? table.participantsUsers[rowIndex][index + 1]
                : table.participantsUsers[rowIndex][index - 1];
            const isWinner = (opponent?.points ?? -1) < newItem.points;
            if ( isWinner && table.participantsUsers.length > (rowIndex + 1) ) {
                table.participantsUsers[rowIndex + 1][Math.floor( index / 2 )] =
                    { ...newItem, points: 0 };

                if ( rowIndex < table.participantsUsers.length - 2 && opponent.index !== -1 ) {
                    const outsiderIndex = rowIndex > 0 ?
                        Math.floor( (table.outsidersUsers[rowIndex - 1].length + index) / 2 ) : Math.floor( index / 2 );
                    table.outsidersUsers[rowIndex][outsiderIndex] = { ...opponent, points: 0 };
                }
            }
            if ( rowIndex > 0 ) {
                const prevRowIndex = rowIndex - 1;
                const prevItems = [
                    table.participantsUsers[prevRowIndex][index * 2],
                    table.participantsUsers[prevRowIndex][index * 2 + 1]
                ].filter(
                    option => option !== undefined && option.index !== -1
                );
                if ( rowIndex < table.participantsUsers.length - 1 && prevItems.length === 2 && prevItems[0].points ===
                    prevItems[1].points ) {
                    const loser = prevItems[0].index === newItem.index ? prevItems[1] : prevItems[0];
                    const outsiderIndex = prevRowIndex > 0 ?
                        Math.round( table.outsidersUsers[prevRowIndex - 1].length / 2 ) + index : index;
                    table.outsidersUsers[prevRowIndex][outsiderIndex] = { ...loser, points: 0 };
                }
            }

            table.participantsUsers[rowIndex][index] = newItem;

            return table;
        } );
    }

    function setOutsider( newItem: CompetitionParticipant<Team | IUser>, rowIndex: number, index: number ) {
        setTable( ( prevState ) => {
            const table = { ...prevState };
            const opponent = index % 2 === 0
                ? table.outsidersUsers[rowIndex][index + 1]
                : table.outsidersUsers[rowIndex][index - 1];
            const isWinner = (opponent?.points ?? -1) < newItem.points;
            if ( isWinner && table.outsidersUsers.length > (rowIndex + 1) ) {
                table.outsidersUsers[rowIndex + 1][Math.floor( index / 2 )] = { ...newItem, points: 0 };
            }

            table.outsidersUsers[rowIndex][index] = newItem;

            return table;
        } );
    }

    async function saveTable(
        table: CompetitionTableDTO,
        parentType: "competition" | "tournament",
        parentId: number,
        request: ReturnType<typeof useTypedHttp<any, any>>["request"]
    ): Promise<CompetitionTable> {
        const requestData: CompetitionTableDTORequest = {
            allowShuffle: table.allowShuffle,
            itemsInTeam: table.itemsInTeam,
            type: table.type,
            parentType,
            ...(parentType === "tournament" ? { tournamentId: parentId } : { competitionId: parentId }),
            participants: table.participantsUsers.map( participantsRow => participantsRow.map(
                participantsItem => ({
                    ...participantsItem, items: participantsItem.items.map( item => item.id )
                }) ) ),
            isOutsiders: table.isOutsiders,
            outsiders: table.outsidersUsers.map( outsidersRow => outsidersRow.map(
                outsidersItem => ({
                    ...outsidersItem, items: outsidersItem.items.map( item => item.id )
                }) ) ),
            ...(table.id ? { id: table.id } : {})
        };
        const { data }: ResponseData<CompetitionTable> = await request( "/api/competition/table", "POST", requestData );
        return data;
    }

    return {
        toggleIsOutsiders, addItem, removeItem, toggleAllowShuffle, setParticipantType,
        setItemsInTeam, shuffle, setParticipant, setOutsider, saveTable
    };
}
