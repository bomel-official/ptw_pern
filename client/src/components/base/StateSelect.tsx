import React, {useState} from 'react';
import {__} from "../../multilang/Multilang";

const StateSelect = ({text = "Выбрать", options, setValue}: {
    text: string,
    options: Array<{ value: any, text: string }>,
    setValue: (value: any) => void
}) => {
    const [isActive, setIsActive] = useState<boolean>(false)
    return (
        <div className={isActive ? "select active" : "select"}>
            <div className="select__current" onClick={() => setIsActive(!isActive)}>
                <span className="select__value-text">{__(text)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="select__options">
                {options.map((option, index) => (
                    <div className="select__option" key={index} onClick={() => {
                        setIsActive(false)
                        setValue(option.value)
                    }}>
                        <span className="select__option-text">{__(option.text)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StateSelect;