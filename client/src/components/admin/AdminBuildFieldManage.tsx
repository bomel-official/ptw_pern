import React, {useContext, useEffect, useState} from 'react';
import {__, _f} from "../../multilang/Multilang";
import {IMessageOptions} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import Select from "../base/Select";

type BuildFields = 'weapon' | 'weapon-type' | 'attachment' | 'attachment-type' | 'mode'

const AdminBuildFieldManage = ({
   slug,
   title,
   createTitle,
   deleteTitle,
   columns,
   fields
} : {
    slug: string,
    title: string,
    createTitle: string,
    deleteTitle: string,
    columns: number
    fields: Array<{
        title: string,
        name: string,
        type: 'text' | 'image' | 'checkbox' | 'select',
        valuesName?: BuildFields
    }>
}) => {
    const [newItem, setNewItem] = useState<Record<string, any>>({})
    const [items, setItems] = useState<Array<Record<string, any>>>([])
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [associations, setAssociations] = useState<Record<string, Array<any>>>({})

    const changeNewItem = (key: string, value: any) => {
        setNewItem({...newItem, [key]: value})
    }

    const getNewTeamEditor = (key: string) => {
        return function (value: any) {
            setNewItem({...newItem, [key]: value})
        }
    }

    const formData = new FormData()
    const {loading, request, error, clearError} = useHttp()
    const auth = useContext(AuthContext)

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])

    const createHandler = async (event: any) => {
        event.preventDefault()
        clearError()
        try {
            for (let key in newItem) {
                if (newItem.hasOwnProperty(key)) {
                    formData.set(key, newItem[key])
                }
            } // add data to formData from form state
            const {message, item}: {message: string, item: Record<string, any>} = await request(`/api/build/admin/${slug}/create`, 'POST', formData, {
                Authorization: `Bearer ${auth.token}`
            }, false)
            setMessageOptions({
                status: 'pos', text: message
            })
            setItems([...items, item])
            setNewItem({})
        } catch (e) {}
    }

    const deleteHandler = async (event: any, itemId: number) => {
        event.preventDefault()
        try {
            const {message} = await request(`/api/build/admin/${slug}/delete`, 'POST', {itemId}, {
                Authorization: `Bearer ${auth.token}`
            }, true)
            setItems(items.filter((item: any) => (item.id !== itemId)))
        } catch (e) {}
    }

    const getItems = async (itemsSlug: string): Promise<any> => {
        let result = []
        try {
            result = await request(`/api/build/admin/${itemsSlug}/get-all`, 'GET')
        } catch (e) {}
        return result.items
    }

    useEffect(() => {
        getItems(slug).then((resItems) => setItems(resItems)).catch(e => {})
        fields.forEach(field => {
            if (field.type === 'select') {
                getItems(field.valuesName || 'null').then((resItems) => setAssociations({...associations,  [field.valuesName || 'null']: resItems})).catch(e => {})
            }
        });
    }, [])


    return (
        <div className="mb24">
            <h2 className="profile__heading mb12">{__(title)}</h2>
            <form className="build__data-block" action="null" method="POST" onSubmit={createHandler}>
                <p className="build__label">{__(createTitle)}</p>
                <div
                    className="build__grid-row"
                    style={{
                        gridAutoFlow: 'row',
                        gridTemplateColumns: `repeat(${columns}, 1fr)`
                    }}
                >
                    {fields.map((field, index) => (
                        <div key={index}>
                            {field.type === 'text' && <label htmlFor={field.name} className="input">
                                <input
                                    id={`${slug}-${field.name}`}
                                    type="text"
                                    name={`${slug}-${field.name}`}
                                    placeholder={__(field.title)}
                                    required={true}
                                    onChange={e => changeNewItem(field.name, e.target.value)}
                                    value={newItem[field.name] ? String(newItem[field.name]) : ''}
                                />
                            </label>}
                            {field.type === 'image' && <label htmlFor={`${slug}-${field.name}`} className="input fileInput" style={{justifyContent: 'flex-start', paddingLeft: '8px', paddingRight: '8px'}}>
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 12.5L15.4283 9.92833C15.1158 9.61588 14.6919 9.44036 14.25 9.44036C13.8081 9.44036 13.3842 9.61588 13.0717 9.92833L5.5 17.5M4.66667 2.5H16.3333C17.2538 2.5 18 3.24619 18 4.16667V15.8333C18 16.7538 17.2538 17.5 16.3333 17.5H4.66667C3.74619 17.5 3 16.7538 3 15.8333V4.16667C3 3.24619 3.74619 2.5 4.66667 2.5ZM9.66667 7.5C9.66667 8.42047 8.92047 9.16667 8 9.16667C7.07953 9.16667 6.33333 8.42047 6.33333 7.5C6.33333 6.57953 7.07953 5.83333 8 5.83333C8.92047 5.83333 9.66667 6.57953 9.66667 7.5Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="fileInput__text">{newItem[field.name] && newItem[field.name].name ? newItem[field.name].name : __('Изображение')}</span>
                                <input
                                    id={`${slug}-${field.name}`}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    name={`${slug}-${field.name}`}
                                    placeholder={__("Изображение")}
                                    onChange={e => changeNewItem(field.name, e.target.files ? e.target.files[0] : null )}
                                />
                            </label>}
                            {field.type === 'checkbox' && <label className={!!newItem[field.name] ? "admin__checkbox active" : "admin__checkbox"} onClick={e => changeNewItem(field.name, !(newItem[field.name]))}>
                                <span className="admin__checkbox-rect"></span>
                                <span className="admin__checkbox-label">{__(field.title)}</span>
                            </label>}
                            {field.type === 'select' && <Select
                                options={associations[field.valuesName || 'null'] ? associations[field.valuesName || 'null'].map((item) => ({value: item.id, text: _f(item, 'title')})) : []}

                                changeValue={getNewTeamEditor(field.name)}
                                defaultText={newItem[field.name] ? newItem[field.name] : field.title}
                                defaultValue={newItem[field.name] || ''}
                            />}
                        </div>
                    ))}
                </div>
                { messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
                <div className="admin__submit-wrapper pt12">
                    <button className="button-both-accent corner-margin">{__("Добавить")}</button>
                </div>
            </form>
            {!!items.length && <div className="build__data-block">
                <p className="build__label">{__(deleteTitle)}</p>
                <div
                    className="build__grid-row admin__build-items"
                    style={{
                        gridAutoFlow: 'row',
                        gridTemplateColumns: `repeat(${columns}, 1fr)`
                    }}
                >
                    {items.map((item) => (
                        <li className="admin__build-item black-corner-both">
                            <span className="admin__build-item-text">{_f(item, 'title')}</span>
                            <button className="admin__build-item-delete"
                                    onClick={(event: any) => deleteHandler(event, item.id)}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996"
                                        stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default AdminBuildFieldManage;