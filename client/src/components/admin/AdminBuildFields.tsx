import React from 'react';
import {__, _f} from "../../multilang/Multilang";
import Select from "../base/Select";
import {BuildFields} from "./AdminBuildFieldManage";
import {GameVersions, IGameVersionObject} from "../../data/Games";

const AdminBuildFields = ({
    fields,
    slug,
    newItem,
    changeNewItem,
    associations,
    getNewItemEditor
}: {
    slug: string,
    newItem: Record<string, any>,
    changeNewItem: (key: string, value: any) => void,
    associations: Record<string, Array<any>>,
    getNewItemEditor: (key: string) => ((value: any) => void),
    fields: Array<{
        title: string,
        name: string,
        type: 'text' | 'image' | 'checkbox' | 'select' | 'selectGame',
        valuesName?: BuildFields
    }>
}) => {
    return (
        <>
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
                    {field.type === 'image' && <label htmlFor={`${newItem.id || 'null'}-${slug}-${field.name}`} className="input fileInput" style={{justifyContent: 'flex-start', paddingLeft: '8px', paddingRight: '8px'}}>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 12.5L15.4283 9.92833C15.1158 9.61588 14.6919 9.44036 14.25 9.44036C13.8081 9.44036 13.3842 9.61588 13.0717 9.92833L5.5 17.5M4.66667 2.5H16.3333C17.2538 2.5 18 3.24619 18 4.16667V15.8333C18 16.7538 17.2538 17.5 16.3333 17.5H4.66667C3.74619 17.5 3 16.7538 3 15.8333V4.16667C3 3.24619 3.74619 2.5 4.66667 2.5ZM9.66667 7.5C9.66667 8.42047 8.92047 9.16667 8 9.16667C7.07953 9.16667 6.33333 8.42047 6.33333 7.5C6.33333 6.57953 7.07953 5.83333 8 5.83333C8.92047 5.83333 9.66667 6.57953 9.66667 7.5Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="fileInput__text">{newItem[field.name] && newItem[field.name].name ? newItem[field.name].name : __('Изображение')}</span>
                        <input
                            id={`${newItem.id || 'null'}-${slug}-${field.name}`}
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

                        changeValue={getNewItemEditor(field.name)}
                        defaultText={newItem[field.name] ? _f(associations[field.valuesName || 'null'].filter(ass => ass.id === newItem[field.name])[0], 'title') || newItem[field.name] : field.title}
                        defaultValue={newItem[field.name] || ''}
                    />}
                    {field.type === 'selectGame' && <Select
                        options={Object.values(GameVersions).map((ver: IGameVersionObject) => ({text: ver.name, value: ver.id}))}
                        changeValue={getNewItemEditor(field.name)}
                        defaultText={newItem[field.name] ? GameVersions[newItem[field.name] || 'mw2'].name : field.title}
                        defaultValue={newItem[field.name] || ''}
                    />}
                </div>
            ))}
        </>
    );
};

export default AdminBuildFields;