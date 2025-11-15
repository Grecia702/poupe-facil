export class HttpError extends Error {
    public readonly statusCode: number
    public readonly details?: number
    constructor(message: string, statusCode: number, details?: any) {
        super(message)
        this.statusCode = statusCode
        this.details = details
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(message, 400)
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(message, 401)
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(message, 403)
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404)
    }
}
export class UnprocessableEntityError extends HttpError {
    constructor(message: string) {
        super(message, 422)
    }
}
export class BadGatewayError extends HttpError {
    constructor(message: string) {
        super(message, 502)
    }
}


