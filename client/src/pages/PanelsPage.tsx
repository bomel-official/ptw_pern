import React, {MouseEvent} from 'react';
import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {__} from "../multilang/Multilang";

const PanelsPage = () => {
    return (
        <div className="PanelsPage full-height header-padding">
            <Header/>
            <div className="panels pt64">
                <div className="container">
                    <h1 className="panels__heading mb24">{__('Обратная связь')}</h1>
                    <ul className="panels__list">
                        <li className="panels__item panel mb24">
                            <button
                                className="panel__title"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault()
                                    e.currentTarget.parentElement?.classList.toggle('active')
                                }}
                            >
                                <span>Вопрос и ответ</span>
                                <div className="panel__icon">
                                    <span/>
                                    <span/>
                                </div>
                            </button>
                            <div className="panel__content">
                                <p>Lorem ipsum dolor sit amet consectetur. Leo viverra donec purus in neque facilisi dictum nisl eget. Varius nec sagittis quis pellentesque. Sagittis laoreet sed sed dictumst laoreet nullam ut sit.
                                    In elementum pellentesque placerat vestibulum consectetur tortor sed. Ullamcorper cras tortor potenti proin orci egestas placerat.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default PanelsPage;