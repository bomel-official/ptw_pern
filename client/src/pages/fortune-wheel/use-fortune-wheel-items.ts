import { useEffect, useState } from "react";
import { FortuneWheelItem, RandomColor } from "./types";

const NEW_ITEM: FortuneWheelItem = {
    label: "",
    weight: 1,
    color: "#E62C1B",
    contrast: "#FFFFFF"
};

const LOCAL_STORAGE_KEY = "fortune-wheel-items";

export function useFortuneWheelItems() {
    const [ items, setItems ] = useState<FortuneWheelItem[]>( [] );
    const [ initialized, setInitialized ] = useState( false );

    function generateNewColor(): RandomColor {
        const letters = "0123456789ABCDEF";
        let color = "";
        let sumOfNumbers = 0;
        for ( let i = 0; i < 6; i++ ) {
            const number = Math.floor( Math.random() * 16 );
            sumOfNumbers += number;
            color += letters[number];
        }
        console.log(color, sumOfNumbers);
        return {
            color: `#${ color }`,
            contrast: `#${ sumOfNumbers >= 32 ? "000000" : "FFFFFF" }`
        } as const;
    }

    function addItem() {
        if ( items.length < 100 ) {
            const randomColor = generateNewColor();
            setItems( ( prevState ) => ([ ...prevState,
                { ...NEW_ITEM, color: randomColor.color, contrast: randomColor.contrast } ]) );
        }
    }

    function removeItem( index: number ) {
        setItems( ( prevState ) => prevState.filter( ( _, i ) => i !== index ) );
    }

    function changeItem( newItem: FortuneWheelItem, index: number ) {
        setItems( ( prevState ) => prevState.map( ( item, i ) => (i === index ? newItem : item) ) );
    }

    useEffect( () => {
        if ( initialized ) {
            localStorage.setItem( LOCAL_STORAGE_KEY, JSON.stringify( items ) );
        }
    }, [ items, initialized ] );

    useEffect( () => {
        const storageItems = localStorage.getItem( LOCAL_STORAGE_KEY );
        const parsedStorageItems = storageItems ? JSON.parse( storageItems ) : [];
        if ( storageItems && Array.isArray( parsedStorageItems ) && parsedStorageItems.every( ( item ) =>
            (item && typeof item === "object" && typeof item.label === "string" && typeof item.weight === "number")
        ) ) {
            setItems( parsedStorageItems );
            setInitialized( true );
        }
    }, [] );

    return { items, addItem, removeItem, changeItem };
}
