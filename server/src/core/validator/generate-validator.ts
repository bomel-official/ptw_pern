import { ApiError } from "@error";
import { ValidatorResponse } from "./types";

export function generateValidator<TData extends Record<string, any>>( getData: () => TData ): ValidatorResponse<TData> {
    try {
        return {
            error: false,
            data: getData(),
            errorObject: null
        };
    } catch ( e ) {
        return {
            error: true,
            data: null,
            errorObject: e as ApiError
        };
    }
}
