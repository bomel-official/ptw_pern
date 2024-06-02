import { ValidatorErrorResponse, ValidatorResponse } from "./types";

export function isError( validated: ValidatorResponse ): validated is ValidatorErrorResponse {
    return validated.error && validated.errorObject !== null ||
        validated.data === null;
}
