import React, {useEffect, useState} from 'react';
import {__, _f} from "../../multilang/Multilang";
import {BuildFields} from "./AdminBuildFieldManage";
import Select from "../base/Select";
import {useHttp} from "../../hooks/http.hook/http-hook";
import AdminBuildFields from "./AdminBuildFields";

const AdminMetaBuildFieldItem = ({
    slug,
    item,
    deleteHandler,
    editHandler,
    fields
}: {
    slug: string,
    item: Record<string, any>,
    deleteHandler: (event: any, itemId: number) => void,
    editHandler: (event: any, item: Record<string, any>) => void,
    fields: Array<{
        title: string,
        name: string,
        type: 'text' | 'image' | 'checkbox' | 'select' | 'selectGame' | 'checkMatch',
        valuesName?: BuildFields
    }>
}
) => {
    const [newItem, setNewItem] = useState<Record<string, any>>(item)
    const [isEditMode, setIsEditMode] = useState(false)
    const [associations, setAssociations] = useState<Record<string, Array<any>>>({})

    const changeNewItem = (key: string, value: any) => {
        setNewItem({...newItem, [key]: value})
    }

    const getNewItemEditor = (key: string) => {
        return function (value: any) {
            setNewItem({...newItem, [key]: value})
        }
    }

    const getItems = async (itemsSlug: string): Promise<any> => {
        let result = []
        try {
            result = await request(`/api/build/admin/${itemsSlug}/get-all`, 'GET')
        } catch (e) {}
        return result.items
    }

    const {request} = useHttp()

    useEffect(() => {
        if (isEditMode) {
            const associationsPromises: Array<Promise<any>> = []
            fields.forEach(field => {
                if (field.type === 'checkMatch' || field.type === 'select') {
                    associationsPromises.push(new Promise((resolve) => {
                        getItems(field.valuesName || 'null').then(resItems => {
                            resolve({
                                name: field.valuesName,
                                items: resItems
                            })
                        })
                    }))
                }
            });
            Promise.all(associationsPromises).then(values => {
                let newAssociations: Record<string, any> = {}
                for (let value of values) {
                    newAssociations = {...newAssociations, [value.name]: value.items}
                }
                setAssociations({
                    ...associations,
                    ...newAssociations
                })
            }).catch(e => {})
        }
    }, [isEditMode])

    return (
        <li className="admin__build-item" style={isEditMode ? {
            width: '100%'
        } : {}}>
            {!isEditMode && <span className="admin__build-item-text">{_f(newItem, 'title')}</span>}
            {!isEditMode && <button className="admin__build-item-delete" onClick={() => setIsEditMode(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 16.6667H17.5M13.75 2.91669C14.0815 2.58517 14.5312 2.39893 15 2.39893C15.2321 2.39893 15.462 2.44465 15.6765 2.53349C15.891 2.62233 16.0858 2.75254 16.25 2.91669C16.4142 3.08085 16.5444 3.27572 16.6332 3.4902C16.722 3.70467 16.7678 3.93455 16.7678 4.16669C16.7678 4.39884 16.722 4.62871 16.6332 4.84319C16.5444 5.05766 16.4142 5.25254 16.25 5.41669L5.83333 15.8334L2.5 16.6667L3.33333 13.3334L13.75 2.91669Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>}
            {isEditMode && <form
                action="null"
                method="POST"
                onSubmit={(event: any) => {
                    setIsEditMode(false)
                    editHandler(event, newItem)
                }}
                className="admin__build-field-items"
            >
                <div className="build__grid-row admin__build-edit-rows">
                    <AdminBuildFields
                        fields={fields}
                        slug={slug}
                        getNewItemEditor={getNewItemEditor}
                        changeNewItem={changeNewItem}
                        associations={associations}
                        newItem={newItem}
                    />
                </div>
                <div className="admin__submit-wrapper">
                    <button className="button-tl-accent">{__("Сохранить")}</button>
                    <button
                        className="button-br-gray"
                        onClick={e => {
                            e.preventDefault()
                            setIsEditMode(false)
                        }}
                    >{__("Отмена")}</button>
                </div>
            </form>}
            {isEditMode && <button className="admin__build-item-delete"
                     onClick={(event: any) => {
                         deleteHandler(event, item.id)
                     }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996"
                        stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                </svg>
            </button>}
        </li>
    );
};

export default AdminMetaBuildFieldItem;
