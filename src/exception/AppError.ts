export class AppError extends Error {
    constructor(message) {
        super(message);
    }
}

export class ApiError extends AppError {
    constructor(errorResponse) {
        super(errorResponse["message"]);
    }
}

export class InvalidTokenError extends AppError {
    constructor() {
        super("Invalid token");
    }
}