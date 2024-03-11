import React, {useContext} from 'react';
import {LanguageContext} from "../../context/LanguageContext";
import {ReactChildren} from "../../ReactTypes";

const EuText = ({children}: {children: ReactChildren}) => {
    const { language } = useContext(LanguageContext)
    if (language !== 'EU') return (<></>)

    return (
        <>
            {children}
        </>
    );
};

export default EuText;