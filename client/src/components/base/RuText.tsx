import React, {useContext} from 'react';
import {LanguageContext} from "../../context/LanguageContext";
import {ReactChildren} from "../../ReactTypes";

const RuText = ({children}: {children: ReactChildren}) => {
    const { language } = useContext(LanguageContext)
    if (language !== 'RU') return (<></>)

    return (
        <>
            {children}
        </>
    );
};

export default RuText;