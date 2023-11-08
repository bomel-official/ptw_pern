import React, {useContext, useEffect, useState} from 'react';
import {__, _f} from "../../multilang/Multilang";
import {IMessageOptions} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import Select from "../base/Select";
import AdminMetaBuildFieldItem from "./AdminMetaBuildFieldItem";
import AdminBuildFields from "./AdminBuildFields";

export type BuildFields = 'weapon' | 'weapon-type' | 'attachment' | 'attachment-type' | 'mode'

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
        type: 'text' | 'image' | 'checkbox' | 'select' | 'selectGame',
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

    const getNewItemEditor = (key: string) => {
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

    const editHandler = async (event: any, item: Record<string, any>) => {
        event.preventDefault()
        try {
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    formData.set(key, item[key])
                }
            }
            const {message, changedItem}: {message: string, changedItem: Record<string, any>} = await request(`/api/build/admin/${slug}/edit`, 'POST', formData, {
                Authorization: `Bearer ${auth.token}`
            }, false)
            const newItems = [...items]
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === changedItem.id) {
                    newItems[i] = changedItem
                }
            }
            setItems(newItems)
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
                    <AdminBuildFields
                        fields={fields}
                        slug={slug}
                        getNewItemEditor={getNewItemEditor}
                        changeNewItem={changeNewItem}
                        associations={associations}
                        newItem={newItem}
                    />
                </div>
                { messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
                <div className="admin__submit-wrapper">
                    <button className="button-both-accent">{__("Добавить")}</button>
                </div>
            </form>
            {!!items.length && <div className="build__data-block">
                <p className="build__label">{__(deleteTitle)}</p>
                <div className="build__grid-row admin__build-items">
                    {items.map((item) => (
                        <AdminMetaBuildFieldItem
                            item={item}
                            deleteHandler={deleteHandler}
                            editHandler={editHandler}
                            fields={fields}
                            slug={slug}
                            key={item.id}
                        />
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default AdminBuildFieldManage;