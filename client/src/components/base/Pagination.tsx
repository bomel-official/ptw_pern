import React, {Dispatch, useState} from 'react';
import {__} from "../../multilang/Multilang";

const Pagination = ({page, amountPages, setPage, displayNumber, setDisplayNumber, mb}: {
    page: number,
    amountPages: number,
    setPage: Dispatch<number>,
    displayNumber: number,
    setDisplayNumber: Dispatch<number>,
    mb?: number
}) => {
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    return (
        <div className="pagination" style={{marginBottom: mb ? `${mb}px` : `48px`}}>
            <div className="pagination__left">
                {page > 1 && <button
                    className="pagination__prev"
                    onClick={() => setPage(page - 1)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button> }
                {page <= 1 && <button
                    className="pagination__prev"
                    disabled
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button> }
                {page > 1 && <button
                    className="pagination__number"
                    onClick={() => setPage(page - 1)}
                >
                    <span>{page - 1}</span>
                </button>}
                <button className="pagination__number active" disabled>
                    <span>{page}</span>
                </button>
                {page < amountPages && <button
                    className="pagination__number"
                    onClick={() => setPage(page + 1)}
                >
                    <span>{page + 1}</span>
                </button>}
                {page < amountPages && <button
                    className="pagination__next"
                    onClick={() => setPage(page + 1)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>}
                {page >= amountPages && <button
                    className="pagination__next"
                    disabled
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>}
            </div>
            <div className="pagination__right">
                <div className="dropdown">
                    <button
                        className="dropdown__current"
                        onClick={() => setIsDropdownActive(!isDropdownActive)}
                    >
                        <span>{__('Отображать')} {displayNumber}</span>
                        <span className="ml-auto">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </button>
                    <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                        {[2, 4, 6, 8, 10].map((num, index) => (
                            (num !== displayNumber) && <li className="dropdown__value" key={index}>
                                <button
                                    onClick={() => {
                                        setDisplayNumber(num)
                                        setIsDropdownActive(false)
                                    }}
                                >
                                    {__('Отображать')} {num}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Pagination;