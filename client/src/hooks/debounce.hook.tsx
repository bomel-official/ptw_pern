import { useEffect, useState } from "react";

export const useDebounce = <TValue extends any>( value: TValue, delay: number = 300 ) => {
    const [ debounced, setDebounced ] = useState( value );
    useEffect( () => {
        const timeOut = setTimeout( () => {
            setDebounced( value );
        }, delay );

        return () => clearTimeout( timeOut );
    }, [ value, delay ] );

    return debounced;
};
