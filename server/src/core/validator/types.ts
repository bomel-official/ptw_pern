export type ValidatorErrorResponse = {
    error: boolean,
    errorObject: Error,
    data: null
}

export type ValidatorSuccessResponse<TData extends Record<string, any> = Record<string, any>> = {
    error: boolean,
    errorObject: null,
    data: TData
}

export type ValidatorResponse<TData extends Record<string, any> = Record<string, any>> = ValidatorErrorResponse | ValidatorSuccessResponse<TData>;

export type Val<TType, TIsRequired extends boolean> = TIsRequired extends true ? TType : TType | undefined;
