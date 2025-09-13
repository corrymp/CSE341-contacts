const StatusCodes = (StatusCodes => {
    for (const resType of Object.values(StatusCodes)) for (const [codeName, code] of Object.entries(resType)) StatusCodes[codeName] = code;

    return StatusCodes;
})({
    info: {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103
    },
    success: {
        OK: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206
    },
    redirect: {
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        TemporaryRedirect: 307,
        PermanentRedirect: 308
    },
    userError: {
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        ContentTooLarge: 413,
        URITooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        Imateapot: 418,
        MisdirectedRequest: 421,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451
    },
    serverError: {
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HTTPVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511
    }
});

const handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { StatusCodes, handleErrors };
