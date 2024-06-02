import { Languages } from "./languages";

export type MultilangFieldNameType<TName extends string,
    TLanguages extends string[] = Languages,
    TResult = ""> = TLanguages extends [ infer TLanguage, ...infer TRest ]
    ? TRest extends string[]
        ? TLanguage extends string
            ? MultilangFieldNameType<TName,
                TRest,
                TResult extends ""
                    ? `${ TName }_${ TLanguage }`
                    : TResult | `${ TName }_${ TLanguage }`>
            : TResult
        : TResult
    : TResult;
