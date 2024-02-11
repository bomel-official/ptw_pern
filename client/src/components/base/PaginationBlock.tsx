import React, {useState} from 'react';
import {IUser} from "../../StoreTypes";
import {ReactChildren} from "../../ReactTypes";
import {__} from "../../multilang/Multilang";
import ProfileTablet from "../profile/ProfileTablet";
import Pagination from "./Pagination";

const PaginationBlock = ({items, children}: {items: Array<any>, children: ReactChildren}) => {
    const [displayFriendsList, setDisplayFriendsList] = useState<Array<any>>([])
    const [displayNumber, setDisplayNumber] = useState<number>(4)
    const [page, setPage] = useState<number>(1)
    const [amountPages, setAmountPages] = useState<number>(0)

    return (
        <>
            {!!amountPages && <>
                {children}
                <Pagination
                    page={page}
                    amountPages={amountPages}
                    setPage={setPage}
                    displayNumber={displayNumber}
                    setDisplayNumber={setDisplayNumber}
                />
            </>}
        </>
    );
};

export default PaginationBlock;