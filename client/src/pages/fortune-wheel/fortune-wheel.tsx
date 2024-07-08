import React from "react";
import { Footer } from "../../components/base/Footer";
import { Header } from "../../components/base/Header";
import { __ } from "../../multilang/Multilang";
import { useFortuneWheelItems } from "./use-fortune-wheel-items";
import Wheel from "./wheel";

const FortuneWheel = () => {
    const { items, addItem, removeItem, changeItem } = useFortuneWheelItems();

    return (
        <div className="shop__page header-padding full-height">
            <Header borderBottom={ true }/>
            <div className="shop pt64 pb104">
                <div className="container">
                    <h1 className="shop__header mb12">{ __( "Колесо фортуны" ) }</h1>
                    <div className="fortune-wheel">
                        <div className="fortune-wheel__wrapper">
                            <Wheel items={ items.filter( ( item ) => !!item.label ) }/>
                        </div>
                        <div className="fortune-wheel__data">
                            { items.map( ( item, index ) => (
                                <label className="input-tl mb12" htmlFor={ `fortune-wheel-item-${ index }` }
                                       key={ index }>
                                    <input name={ `fortune-wheel-item-${ index }` } type="text" value={ item.label }
                                           onChange={ ( e ) => {
                                               changeItem( { ...item, label: e.target.value }, index );
                                           } }/>
                                    <button className="fortune-wheel__remove" onClick={ () => removeItem( index ) }>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15" stroke="white"
                                                  strokeOpacity="0.75"
                                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </label>
                            ) ) }
                            <button className="corner-margin button-br-accent" onClick={ addItem }>{ __(
                                "Добавить" ) }</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default FortuneWheel;
