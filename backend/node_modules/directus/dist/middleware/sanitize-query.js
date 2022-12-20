"use strict";
/**
 * Sanitize query parameters.
 * This ensures that query params are formatted and ready to go for the services.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_query_1 = require("../utils/sanitize-query");
const validate_query_1 = require("../utils/validate-query");
const sanitizeQueryMiddleware = (req, _res, next) => {
    req.sanitizedQuery = {};
    if (!req.query)
        return;
    req.sanitizedQuery = (0, sanitize_query_1.sanitizeQuery)({
        fields: req.query.fields || '*',
        ...req.query,
    }, req.accountability || null);
    Object.freeze(req.sanitizedQuery);
    (0, validate_query_1.validateQuery)(req.sanitizedQuery);
    return next();
};
exports.default = sanitizeQueryMiddleware;
