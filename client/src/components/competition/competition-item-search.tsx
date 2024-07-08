import React, { FC, useEffect, useState } from "react";
import { getFile } from "../../functions/getFile";
import { isTeam } from "../../guards";
import { useGetManyUsersTeams } from "../../hooks/competition";
import { useDebounce } from "../../hooks/debounce.hook";
import { __ } from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import { ItemSearchProps } from "./types";

const CompetitionItemSearch: FC<ItemSearchProps> = ( { onSelect, type, exclude = { users: [], teams: [] } } ) => {
    const [ s, setS ] = useState<string>( "" );
    const debounced = useDebounce( s );
    const [ fetchEmpty, setFetchEmpty ] = useState( false );
    const { data: items } = useGetManyUsersTeams( debounced, type, fetchEmpty );
    const [ isDropdownActive, setIsDropdownActive ] = useState( false );

    useEffect( () => {
        if ( isDropdownActive && debounced === "" ) {
            setFetchEmpty( true );
        }
    }, [ isDropdownActive ] );

    return (
        <div className="dropdown">
            <label
                className="dropdown__current"
                onClick={ () => {
                    setIsDropdownActive( !isDropdownActive );
                } }
            >
                <input
                    type="text" placeholder={ type === "user" ? __( "Добавить игрока" ) : __( "Добавить команду" ) }
                    onChange={ ( e: React.ChangeEvent<HTMLInputElement> ) => {
                        setS( e.target.value );
                    } }
                />
            </label>
            <ul className={ isDropdownActive ? "dropdown__values active" : "dropdown__values" }>
                { items.filter( ( item ) => {
                    if ( type === "user" ) {
                        return !exclude.users.find( ( user ) => user.id === item.id );
                    } else {
                        return !exclude.teams.find( ( team ) => team.id === item.id );
                    }
                } ).map( ( item, index ) => (
                    <li className="dropdown__value" key={ item.id }>
                        <button
                            onClick={ () => {
                                setIsDropdownActive( !isDropdownActive );
                                onSelect( item );
                            } }
                        >
                            <div className="profileCard">
                                <img src={ getFile( item.avatar ) || DefaultUserPic }
                                     alt={ (isTeam( item ) ? item.name : item.nickname) || "Item avatar" }
                                     className="profileCard__avatar"/>
                                <div className="profileCard__top">
                                    <span className="profileCard__nickname">{ isTeam( item ) ? item.name :
                                        item.nickname }</span>
                                </div>
                            </div>
                        </button>
                    </li>
                ) ) }
            </ul>
        </div>
    );
};

export default CompetitionItemSearch;
