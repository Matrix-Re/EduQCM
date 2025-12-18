export function apiError(status, message, details = null) {
    return {
        success: false,
        status,
        error: getErrorType(status),
        message,
        details
    };
}

function getErrorType(status) {
    switch (status) {
        case 400:
            return "BAD_REQUEST";
        case 401:
            return "UNAUTHORIZED";
        case 403:
            return "FORBIDDEN";
        case 404:
            return "NOT_FOUND";
        case 500:
            return "INTERNAL_SERVER_ERROR";
        default:
            return "UNKNOWN_ERROR";
    }
}

export function throwError(status, message, details = null) {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    throw error;
}