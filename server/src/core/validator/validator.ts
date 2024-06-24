import { ApiError } from "@error";
import { Val } from "./types";

export class CV<TValue, TIsRequired extends boolean = true> {
    private readonly value: TValue;

    private readonly label?: string;

    private readonly isRequired: boolean;

    private message( text: string ) {
        return this.label ? text : "Некорректный запрос";
    }

    private get options() {
        return {
            label: this.label,
            isRequired: this.isRequired as TIsRequired
        };
    }

    private optionalCheckedValue<TGoalType>() {
        if ( this.isRequired ) {
            if ( this.value === null || this.value === undefined ||
                this.value === "null" || this.value === "undefined" ) {
                throw ApiError.badRequest(
                    this.message( `Поле ${ this.label } - обязательно` ) );
            }
        }
        return new CV(
            this.value as Val<TGoalType, TIsRequired>,
            this.options );
    }

    constructor( value: TValue,
                 options?: { label?: string, isRequired?: TIsRequired } ) {
        this.value = value;
        this.label = options?.label;
        this.isRequired = options?.isRequired ?? true;
    }

    public get val() {
        return this.value as TIsRequired extends true ? TValue : TValue | undefined;
    }

    public string() {
        try {
            if ( typeof this.value === "string" ) {
                if ( this.value === "null" || this.value === "undefined" ) {
                    if ( this.isRequired ) {
                        throw ApiError.badRequest(
                            this.message(
                                `Поле ${ this.label } - обязательно` ) );
                    } else {
                        return new CV( undefined as Val<string, TIsRequired>,
                            this.options );
                    }
                }
                return new CV( this.value as Val<string, TIsRequired>,
                    this.options );
            } else if ( typeof (this.value as { toString: () => string }).toString ===
                "function" ) {
                const stringValue = (this.value as { toString: () => string }).toString();
                return new CV( stringValue as Val<string, TIsRequired>,
                    this.options );
            }
            return this.optionalCheckedValue<string>();
        } catch ( e ) {
            throw ApiError.badRequest(
                this.message( `Поле ${ this.label } должно быть срокой` ) );
        }
    }

    public number() {
        try {
            if ( typeof this.value === "number" ) {
                return new CV( this.value as Val<number, TIsRequired>,
                    this.options );
            } else if ( typeof this.value === "string" ) {
                const numValue = JSON.parse( this.value );
                if ( typeof numValue === "number" ) {
                    return new CV( numValue as Val<number, TIsRequired>,
                        this.options );
                }
            }
            return this.optionalCheckedValue<number>();
        } catch ( e ) {
            throw ApiError.badRequest(
                this.message( `Поле ${ this.label } должно быть числом` ) );
        }
    }

    public bool() {
        try {
            if ( typeof this.value === "boolean" ) {
                return new CV( this.value as Val<boolean, TIsRequired>,
                    this.options );
            } else if ( typeof this.value === "string" ) {
                const boolValue = JSON.parse( this.value );
                if ( typeof boolValue === "boolean" ) {
                    return new CV( boolValue as Val<boolean, TIsRequired>,
                        this.options );
                }
            }
            return this.optionalCheckedValue<boolean>();
        } catch ( e ) {
            throw ApiError.badRequest(
                this.message( `Поле ${ this.label } должно быть true/false` ) );
        }
    }

    public array<TArrayValue>( arrayCheck: ( arrayValue: any ) => TArrayValue ) {
        try {
            if ( Array.isArray( this.value ) ) {
                return new CV( this.value.map(
                        arrayCheck ) as Val<TArrayValue[], TIsRequired>,
                    this.options );
            } else if ( typeof this.value === "string" ) {
                const parsedValue = JSON.parse( this.value );
                if ( Array.isArray( parsedValue ) ) {
                    return new CV( parsedValue.map(
                            arrayCheck ) as Val<TArrayValue[], TIsRequired>,
                        this.options );
                }
            }
            return this.optionalCheckedValue<any[]>();
        } catch ( e ) {
            throw ApiError.badRequest( this.message(
                `Значения массива ${ this.label } - некорректны` ) );
        }
    }

    public object<TObjectValue>( objectCheck: ( objectValue: any ) => TObjectValue ) {
        try {
            if ( typeof this.value === "object" && this.value !== null ) {
                return new CV( objectCheck(
                        this.value as object ) as Val<TObjectValue, TIsRequired>,
                    this.options );
            } else if ( typeof this.value === "string" ) {
                const parsedValue = JSON.parse( this.value );
                if ( typeof parsedValue === "object" && parsedValue !== null ) {
                    return new CV( objectCheck(
                            parsedValue as object ) as Val<TObjectValue, TIsRequired>,
                        this.options );
                }
            }
            return this.optionalCheckedValue<object>();
        } catch ( e ) {
            throw ApiError.badRequest( this.message(
                `Значения объекта ${ this.label } - некорректны` ) );
        }
    }

    public included<TArrayValue extends TValue>( arr: TArrayValue[] ) {
        try {
            if ( arr.includes( (this.value as TArrayValue) ) ) {
                return new CV( (this.value as Val<TArrayValue, TIsRequired>),
                    this.options );
            }
            return this.optionalCheckedValue<TArrayValue>();
        } catch ( e ) {
            throw ApiError.badRequest( this.message(
                `Значение ${ this.label } - не корректно` ) );
        }
    }

    public optional() {
        return new CV( this.value,
            { label: this.label, isRequired: false } as const );
    }
}
