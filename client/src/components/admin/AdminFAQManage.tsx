import React, { MouseEvent, useState } from "react";
import {
    useDeleteQuestionMutation,
    useGetQuestionsQuery,
    useUpsertQuestionMutation,
} from "@/entities/question";
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
    const [ newItem, setNewItem ] = useState<Record<string, any>>( newQuestionTemplate );

    const { data: items = [] } = useGetQuestionsQuery();
    const [ upsertQuestion ] = useUpsertQuestionMutation();
    const [ deleteQuestion ] = useDeleteQuestionMutation();

    const changeNewItem = ( key: string, value: string ) => {
        setNewItem( { ...newItem, [key]: value } );
    };

    const deleteHandler = async ( itemToDelete: Record<string, any> ) => {
        try {
            await deleteQuestion( itemToDelete.id ).unwrap();
        } catch ( e: any ) {
            setMessageOptions( { status: "neg", text: e?.data?.message || "Ошибка" } );
        }
    };

    const createOrSaveHandler = async ( event: any, itemToSave: Record<string, any> ) => {
        event.preventDefault();
        try {
            const { message } = await upsertQuestion( itemToSave as any ).unwrap();
            setMessageOptions( { status: "pos", text: message || "" } );
            setNewItem( { ...newQuestionTemplate } );
        } catch ( e: any ) {
            setMessageOptions( { status: "neg", text: e?.data?.message || "Ошибка" } );
        }
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
