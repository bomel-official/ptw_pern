import React, { FC, useState } from "react";
import { __ } from "../../multilang/Multilang";
import { FortuneWheelItem, WheelProps } from "./types";

const VIEW_BOX = 100;
const STROKE_WIDTH = 40;
const TEXT_OFFSET = 5;
const SPIN_DELAY = 5; // Seconds

const PI = Math.PI;
const RADIUS = VIEW_BOX / 2 - STROKE_WIDTH / 2;
const CIRCLE_LENGTH = RADIUS * 2 * PI;

const Wheel: FC<WheelProps> = ( { items } ) => {
    const [ angle, setAngle ] = useState( 0 );
    const [ winner, setWinner ] = useState<null | FortuneWheelItem>( null );
    const [ spinTimeout, setSpinTimeout ] = useState( setTimeout( () => {}, SPIN_DELAY * 1000 ) );

    function spin() {
        const newSpinAngle = angle + 3600 + Math.random() * 3600;
        setAngle( newSpinAngle );
        clearTimeout( spinTimeout );
        setSpinTimeout( setTimeout( () => {
            setWinner(
                items[items.length - 1 - Math.floor( ((newSpinAngle + 90) % 360) / (360 / items.length) )] ?? null
            );
        }, SPIN_DELAY * 1000 ) );
    }

    return (
        <div className="fortune-wheel__wheel-wrapper">
            <div className="fortune-wheel__wheel">
                <svg width="500" height="500" className="fortune-wheel__svg"
                     viewBox={ `0 0 ${ VIEW_BOX } ${ VIEW_BOX }` }
                     style={ {
                         transform: `rotate(${ angle }deg)`,
                         transition: `transform cubic-bezier(.1, .64, 0, .99) ${ SPIN_DELAY }s`
                     } }>
                    { items.map( ( item, index ) => (
                        <>
                            <circle
                                key={ index }
                                className="unit"
                                r={ RADIUS }
                                cx="50%"
                                cy="50%"
                                fill="transparent"
                                stroke={ item.color }
                                strokeWidth={ STROKE_WIDTH }
                                strokeDasharray={ `${ CIRCLE_LENGTH / items.length } ${ CIRCLE_LENGTH }` }
                                strokeDashoffset={ `-${ CIRCLE_LENGTH / items.length * index }` }
                            ></circle>
                            <text
                                x={ 0 }
                                y={ 0 }
                                style={ {
                                    fontWeight: 400,
                                    fontSize: 5,
                                    fontFamily: "inherit"
                                } }
                                fill={ item.contrast }
                                alignmentBaseline="central"
                                textAnchor="start"
                                transform={ `translate(${
                                    VIEW_BOX / 2 + Math.cos( -PI / items.length - 2 * PI / items.length * index ) *
                                    (VIEW_BOX / 2 - TEXT_OFFSET)
                                }, ${
                                    VIEW_BOX / 2 - Math.sin( -PI / items.length - 2 * PI / items.length * index ) *
                                    (VIEW_BOX / 2 - TEXT_OFFSET)
                                }) rotate(${ 180 / items.length * (2 * index + 1) + 180 })` }
                            >{ item.label }</text>
                        </>
                    ) ) }
                </svg>
                <div className="fortune-wheel__button-wrapper">
                    <svg className="fortune-wheel__button-arrow" viewBox="0 0 44 59">
                        <path d="M42 58L22 3L2 58H22H42Z" strokeWidth="2"/>
                    </svg>
                    <button className="fortune-wheel__button" onClick={ spin }>{ __( "Крутить" ) }</button>
                </div>
            </div>
            { winner !== null && <div className="fortune-wheel__winner">
                <span>{ __( "Победитель" ) }: <b>{ winner.label }</b></span>
            </div> }
        </div>
    );
};

export default Wheel;
