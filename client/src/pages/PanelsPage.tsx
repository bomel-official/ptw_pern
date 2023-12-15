import React, {MouseEvent, useEffect, useState} from 'react';
import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {__, _f} from "../multilang/Multilang";
import {IQuestion} from "../StoreTypes";
import {useHttp} from "../hooks/http.hook";

const PanelsPage = () => {
    const [items, setItems] = useState<Array<IQuestion>>([])

    const {request} = useHttp()

    const fetchQuestions = async () => {
        const {rows} = await request(`/api/question/get`, 'GET')
        setItems(rows)
    }

    useEffect(() => {
        fetchQuestions().catch(() => {})
    }, [])
    return (
        <div className="PanelsPage full-height header-padding">
            <Header/>
            <div className="panels pt64">
                <div className="container">
                    <h1 className="panels__heading mb24">{__('Обратная связь')}</h1>
                    {!!items.length && <ul className="panels__list">
                        {items.map((item) => (
                            <li className="panels__item panel mb24">
                                <button
                                    className="panel__title"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault()
                                        e.currentTarget.parentElement?.classList.toggle('active')
                                    }}
                                >
                                    <span>{_f(item, 'question')}</span>
                                    <div className="panel__icon">
                                        <span/>
                                        <span/>
                                    </div>
                                </button>
                                <div className="panel__content">
                                    <p className="mb12">{_f(item, 'answer')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default PanelsPage;