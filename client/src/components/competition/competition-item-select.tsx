import React, { FC, useState } from "react";
import { __ } from "../../multilang/Multilang";
import CompetitionItemCard from "./competition-item";
import { CompetitionItemSelectProps } from "./types";

const CompetitionItemSelect: FC<CompetitionItemSelectProps> = ( { setItem, options } ) => {
    const [ isDropdownActive, setIsDropdownActive ] = useState( false );

    return (
        <div className={ `dropdown mb8` }>
            <label
                className={ `dropdown__current compact` }
                onClick={ () => {
                    setIsDropdownActive( !isDropdownActive );
                } }
            >
                { __( "Выберите победителя" ) }
            </label>
            <ul className={ isDropdownActive ? "dropdown__values active" : "dropdown__values" }>
                { options.map( ( item, index ) => (
                    <li className="dropdown__value" key={ index }>
                        <button
                            style={ { padding: "4px 8px" } }
                            onClick={ () => {
                                setIsDropdownActive( !isDropdownActive );
                                if ( setItem ) {setItem( item );}
                            } }
                        >
                            <CompetitionItemCard
                                item={ item }
                                setItem={ null }
                                isNoPoints={ true }
                            />
                        </button>
                    </li>
                ) ) }
            </ul>
        </div>
    );
};

export default CompetitionItemSelect;
