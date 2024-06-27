import { ValidatorErrorResponse, ValidatorResponse } from "./types";

export function isError( validated: ValidatorResponse | void ): validated is ValidatorErrorResponse | void {
    return !validated || validated.error && validated.errorObject !== null ||
        validated.data === null;
}
