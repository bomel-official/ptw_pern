import React, { MouseEvent } from "react";
import { Footer } from "../components/base/Footer";
import { Header } from "../components/base/Header";
import { useGetQuestionsQuery } from "@/entities/question";
import { __, _f } from "../multilang/Multilang";

const PanelsPage = () => {
    const { data: items = [] } = useGetQuestionsQuery();

    return (
        <div className="PanelsPage full-height header-padding">
            <Header/>
            <div className="panels pt64">
                <div className="container">
                    <h1 className="panels__heading mb24">{ __( "Обратная связь" ) }</h1>
                    { !!items.length && <ul className="panels__list">
                        { items.map( ( item ) => (
                            <li className="panels__item panel mb24" key={ item.id }>
                                <button
                                    className="panel__title"
                                    onClick={ ( e: MouseEvent<HTMLButtonElement> ) => {
                                        e.preventDefault();
                                        e.currentTarget.parentElement?.classList.toggle( "active" );
                                    } }
                                >
                                    <span>{ _f( item, "question" ) }</span>
                                    <div className="panel__icon">
                                        <span/>
                                        <span/>
                                    </div>
                                </button>
                                <div className="panel__content">
                                    <p className="mb12">{ _f( item, "answer" ) }</p>
                                </div>
                            </li>
                        ) ) }
                    </ul> }
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default PanelsPage;
