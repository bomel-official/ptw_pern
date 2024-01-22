import {useContext} from "react";
import {ILang, LanguageContext} from "../context/LanguageContext";
import {Translations} from "../data/Translations";

export const __ = (str: string | null): string => {
    const {language} = useContext(LanguageContext)

    let currentLang: ILang = 'RU'
    if (language !== null) {
        currentLang = language
    }

    if (!str) {
        return ''
    }

    if (Translations[str] && Translations[str][currentLang]) {
        return Translations[str][currentLang]
    }
    return str
}

export const _f = (data: any, field: string): string => {
    const {language} = useContext(LanguageContext)

    let currentLang: ILang = 'RU'
    if (!data) {
        return ''
    }
    if (language !== null) {
        currentLang = language
    }
    return data[`${field}_${currentLang}`]
}