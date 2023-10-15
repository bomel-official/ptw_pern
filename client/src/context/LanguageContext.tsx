import {createContext, Dispatch, SetStateAction} from "react";

function noop() {}

export type ILang = 'RU' | 'EU' | null

interface ILanguageContext {
    language: ILang,
    setLanguage: Dispatch<SetStateAction<ILang>>
}

export const LanguageContext = createContext<ILanguageContext>({
    language: null,
    setLanguage: noop
})