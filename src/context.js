import last from 'lodash/last';

/**
 *
 *
 */
function matches(regex, handler) {
    return function handleContext(req, next) {
        return regex.test(req.context.join(':')) ?
            handler(req, next) :
            next();
    };
}

/**
 *
 *
 */
function custom(fn, handler) {
    return function handleContext(req, next) {
        return fn(req) ?
            handler(req, next) :
            next();
    };
}

/**
 *
 *
 */
function after(event, handler) {
    return function handleContext(req, next) {
        return last(req.context) === event ?
            handler(req, next) :
            next();
    };
}

export const context = {
    matches,
    custom,
    after,
};
