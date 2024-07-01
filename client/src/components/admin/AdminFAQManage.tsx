import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook/http-hook";
import { __, _f } from "../../multilang/Multilang";
import { IMessageOptions } from "../../StoreTypes";

const newQuestionTemplate = {
    id: null,
    question_RU: "",
    question_EU: "",
    answer_RU: "",
    answer_EU: ""
};

const AdminFaqManage = () => {
    const [ messageOptions, setMessageOptions ] = useState<IMessageOptions>( {
        status: "", text: ""
    } );
    const [ items, setItems ] = useState<Array<Record<string, any>>>( [] );
    const [ newItem, setNewItem ] = useState<Record<string, any>>( newQuestionTemplate );

    const { loading, request, error, clearError } = useHttp();
    const auth = useContext( AuthContext );

    const fetchQuestions = async () => {
        const { rows } = await request( `/api/question/get`, "GET" );
        setItems( rows );
    };

    useEffect( () => {
        fetchQuestions().catch( () => {} );
    }, [] );

    useEffect( () => {
        setMessageOptions( {
            status: "neg", text: error
        } );
    }, [ error ] );

    const changeNewItem = ( key: string, value: string ) => {
        setNewItem( { ...newItem, [key]: value } );
    };

    const deleteHandler = async ( itemToDelete: Record<string, any> ) => {
        try {
            const { message }: { message: string, item: Record<string, any> } = await request( `/api/question/delete`,
                "POST", { id: itemToDelete.id }, {
                    Authorization: `Bearer ${ auth.token }`
                }, true );
            if ( message ) {
                setItems( items.filter( (item => (item.id !== itemToDelete.id)) ) );
            }
        } catch ( e ) {}
    };

    const createOrSaveHandler = async ( event: any, itemToSave: Record<string, any> ) => {
        event.preventDefault();
        clearError();
        try {
            const { message, item }: { message: string, item: Record<string, any> } = await request(
                `/api/question/save-create`, "POST", { ...itemToSave, id: itemToSave.id ? itemToSave.id : "" }, {
                    Authorization: `Bearer ${ auth.token }`
                }, true );
            setMessageOptions( {
                status: "pos", text: message
            } );
            if ( item ) {
                setItems( [ ...items, item ] );
                setNewItem( {} );
            }
        } catch ( e ) {}
    };

    const fields = [
        {
            name: "question_RU",
            title: "Вопрос RU",
            type: "input"
        },
        {
            name: "question_EU",
            title: "Вопрос EU",
            type: "input"
        },
        {
            name: "answer_RU",
            title: "Ответ RU",
            type: "textarea"
        },
        {
            name: "answer_EU",
            title: "Ответ EU",
            type: "textarea"
        }
    ];

    return (
        <div className="mb24">
            <h2 className="profile__heading mb12">{ __( "FAQ" ) }</h2>
            <form className="build__data-block" action="null" method="POST"
                  onSubmit={ ( event: any ) => createOrSaveHandler( event, newItem ) }>
                <p className="build__label">{ __( "Добавить вопрос и ответ" ) }</p>
                <div
                    className="build__grid-row"
                    style={ {
                        gridAutoFlow: "row",
                        gridTemplateColumns: `repeat(2, 1fr)`
                    } }
                >
                    { fields.map( ( field ) => (<label htmlFor={ field.name } className="input"
                                                       style={ field.type === "textarea" ?
                                                           { height: "auto", minHeight: "64px" } : {} }>
                        { field.type === "input" && <input
                            id={ `${ field.name }` }
                            type="text"
                            name={ `${ field.name }` }
                            placeholder={ __( field.title ) }
                            required={ true }
                            onChange={ e => changeNewItem( field.name, e.target.value ) }
                            value={ newItem[field.name] }
                        /> }
                        { field.type === "textarea" && <textarea
                            name={ `${ field.name }` }
                            id={ `${ field.name }` }
                            placeholder={ __( field.title ) }
                            required={ true }
                            onChange={ e => changeNewItem( field.name, e.target.value ) }
                            defaultValue={ newItem[field.name] }
                        ></textarea> }
                    </label>) ) }
                </div>
                <div className="admin__submit-wrapper">
                    <button className="button-both-accent">{ __( "Добавить" ) }</button>
                </div>
            </form>
            { messageOptions.text &&
                <div className={ `${ messageOptions.status }-message mb24` }>{ __( messageOptions.text ) }</div> }
            <p className="build__label">{ __( "Редактировать Вопросы и ответы" ) }</p>
            { !!items.length && <div className="build__data-block">
                <ul className="panels__list">
                    { items.map( ( item ) => (
                        <li className="panels__item panel mb24">
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
                                <button className="panel__delete" onClick={ () => deleteHandler( item ) }>{ __(
                                    "Удалить" ) }</button>
                            </div>
                        </li>
                    ) ) }
                </ul>
            </div> }
        </div>
    );
};

export default AdminFaqManage;
