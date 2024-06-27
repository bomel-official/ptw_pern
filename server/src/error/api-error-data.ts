import { ApiError } from "./ApiError";

export function ApiErrorData( error: ApiError ) {
    return {
        error: true,
        errorObject: error,
        data: null
    };
}
