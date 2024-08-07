import React, { FC, MouseEvent, ReactNode, useState } from "react";
import { __ } from "../../multilang/Multilang";

type DropdownProps = {
    options: Array<{
        icon?: ReactNode,
        label: string,
        onClick: () => void
    }>
}

export const Dropdown: FC<DropdownProps> = ( { options } ) => {
    const [ isActive, setIsActive ] = useState( false );

    return (<div className={ `dropdown dropdown-mini ${ isActive ? "active" : "" }` }>
        <button
            className="dropdown__current"
            onClick={ ( e: MouseEvent<HTMLButtonElement> ) => {
                e.preventDefault();
                setIsActive( !isActive );
            } }
        >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10.0007 10.8334C10.4609 10.8334 10.834 10.4603 10.834 10C10.834 9.53978 10.4609 9.16669 10.0007 9.16669C9.54041 9.16669 9.16732 9.53978 9.16732 10C9.16732 10.4603 9.54041 10.8334 10.0007 10.8334Z"
                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M15.834 10.8334C16.2942 10.8334 16.6673 10.4603 16.6673 10C16.6673 9.53978 16.2942 9.16669 15.834 9.16669C15.3737 9.16669 15.0007 9.53978 15.0007 10C15.0007 10.4603 15.3737 10.8334 15.834 10.8334Z"
                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M4.16732 10.8334C4.62755 10.8334 5.00065 10.4603 5.00065 10C5.00065 9.53978 4.62755 9.16669 4.16732 9.16669C3.70708 9.16669 3.33398 9.53978 3.33398 10C3.33398 10.4603 3.70708 10.8334 4.16732 10.8334Z"
                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
        <ul className="dropdown__values">
            { options.map( option => (
                <li className="dropdown__value" key={ option.label }>
                    <button
                        onClick={ async ( e: MouseEvent<HTMLButtonElement> ) => {
                            e.preventDefault();
                            setIsActive( false );
                            option.onClick();
                        } }
                    >
                        { option.icon ?? <></> }
                        <span>{ __( option.label ) }</span>
                    </button>
                </li>
            ) ) }
        </ul>
    </div>);
};
