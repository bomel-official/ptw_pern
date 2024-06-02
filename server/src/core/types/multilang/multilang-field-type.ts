import { Languages } from "./languages";

export type MultilangFieldType<TName extends string,
    TType,
    TIsOptional extends boolean = true,
    TLanguages extends string[] = Languages,
    TResult = {}> = TLanguages extends [ infer TLanguage, ...infer TRest ]
    ? TRest extends string[]
        ? TLanguage extends string
            ? MultilangFieldType<TName,
                TType,
                TIsOptional,
                TRest,
                TIsOptional extends true
                    ? TResult & Partial<Record<`${ TName }_${ TLanguage }`, TType>>
                    : TResult & Record<`${ TName }_${ TLanguage }`, TType>>
            : TResult
        : TResult
    : TResult;
