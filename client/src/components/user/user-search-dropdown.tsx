import React, { FC, useEffect, useState } from "react";
import { getFile } from "../../functions/getFile";
import { useDebounce } from "../../hooks/debounce.hook";
import { useGetManyUsers } from "../../hooks/user/get-many";
import { __ } from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import { IUser } from "../../StoreTypes";
import { UserSearchDropdownProps } from "./types";

const UserSearchDropdown: FC<UserSearchDropdownProps> = ( { onSelect, initialUser, options, variant = "normal" } ) => {
    const [ s, setS ] = useState<string>( "" );
    const debounced = useDebounce( s );
    const [ fetchEmpty, setFetchEmpty ] = useState( false );
    const { data: users } = useGetManyUsers( debounced, fetchEmpty );
    const [ isDropdownActive, setIsDropdownActive ] = useState( false );
    const [ selectedUser, setSelectedUser ] = useState<IUser | null>( null );

    useEffect( () => {
        if ( initialUser ) {
            setSelectedUser( initialUser );
        }
    }, [ initialUser ] );

    useEffect( () => {
        if ( isDropdownActive && debounced === "" ) {
            setFetchEmpty( true );
        }
    }, [ isDropdownActive ] );

    return (
        <div className={ `dropdown ${ variant === "compact" ? "mb8" : "mb24" }` }>
            <label
                className={ `dropdown__current ${ variant }` }
                onClick={ () => {
                    setIsDropdownActive( !isDropdownActive );
                    setSelectedUser( null );
                    onSelect( null );
                } }
            >
                { selectedUser !== null && <div className="profileCard">
                    <img src={ getFile( selectedUser.avatar ) || DefaultUserPic }
                         alt={ selectedUser.nickname || "Team avatar" }
                         className="profileCard__avatar"/>
                    <div className="profileCard__top">
                        <span className="profileCard__nickname">{ selectedUser.nickname }</span>
                    </div>
                </div> }
                { selectedUser === null && <input
                    type="text" placeholder={ __( "Выберите игрока" ) }
                    onChange={ ( e: React.ChangeEvent<HTMLInputElement> ) => {
                        setS( e.target.value );
                    } }/> }
            </label>
            <ul className={ isDropdownActive ? "dropdown__values active" : "dropdown__values" }>
                { (options && !!options.filter( ( option ) => option !== null ).length ?
                    options.filter(
                        ( user ) => user && user.nickname.toLowerCase().includes( debounced.toLowerCase() ) ) :
                    users).map( ( user: IUser | null, index ) => (
                    <div key={ user ? user.id : `index${ index }` }>
                        { user && <li className="dropdown__value">
                            <button
                                onClick={ () => {
                                    setSelectedUser( user );
                                    setIsDropdownActive( !isDropdownActive );
                                    onSelect( user );
                                } }
                            >
                                <div className="profileCard">
                                    <img src={ getFile( user.avatar ) || DefaultUserPic }
                                         alt={ user.nickname || "Team avatar" }
                                         className="profileCard__avatar"/>
                                    <div className="profileCard__top">
                                        <span className="profileCard__nickname">{ user.nickname }</span>
                                    </div>
                                </div>
                            </button>
                        </li> }
                    </div>
                ) ) }
            </ul>
        </div>
    );
};

export default UserSearchDropdown;
