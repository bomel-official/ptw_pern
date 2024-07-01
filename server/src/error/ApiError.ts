export class ApiError extends Error {
    public readonly status: number;

    constructor( status: number, message?: string ) {
        super();
        this.status = status;
        this.message = message || "Произошла ошибка, попробуйте позже";
    }

    // Client Errors
    static badRequest( message?: string ) {
        return new ApiError( 400, message || "Некорректный запрос" );
    }

    static unauthorized( message?: string ) {
        return new ApiError( 401, message || "Не авторизован" );
    }

    static forbidden( message: string ) {
        return new ApiError( 403, message );
    }

    static notFound( message: string ) {
        return new ApiError( 404, message );
    }

    static mediaError( message: string ) {
        return new ApiError( 415, message );
    }

    // Server Errors
    static internal( message: string ) {
        return new ApiError( 500, message );
    }
}
