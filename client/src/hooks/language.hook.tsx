import {useEffect, useState} from "react";
import {ILang} from "../context/LanguageContext";

const storageName = 'userLanguage'

interface IStorageLang {
    currentLanguage: ILang
}

export const useLanguage = () => {
    const [language, setLanguage] = useState<ILang>(null)

    useEffect(() => {
        const storageLang: IStorageLang = JSON.parse(localStorage.getItem(storageName) || '{}')
        if (storageLang && storageLang.currentLanguage) {
            setLanguage(storageLang.currentLanguage)
        } else {
            setLanguage('RU')
        }
    }, [])


    useEffect(() => {
        if (language !== null) {
            const newStorageLang: IStorageLang = {
                currentLanguage: language
            }
            localStorage.setItem(storageName, JSON.stringify(newStorageLang))
        }
    }, [language])


    return {language, setLanguage}
}