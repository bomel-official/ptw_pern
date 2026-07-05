import { Response } from "express";

/** Unified success envelope returned by all module controllers. */
export interface ApiSuccess<T> {
    ok: true;
    data: T;
    message?: string;
}

/** Unified failure envelope emitted by the error-handling middleware. */
export interface ApiFailure {
    ok: false;
    message: string;
    details?: unknown;
}

/** Send a standardized success response. */
export function sendSuccess<T>(
    res: Response,
    data: T,
    message?: string,
    status = 200,
): Response<ApiSuccess<T>> {
    return res.status( status ).json( { ok: true, data, message } );
}
