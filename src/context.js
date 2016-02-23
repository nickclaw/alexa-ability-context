import last from 'lodash/last';

/**
 * Middleware creator that only executes the handler when
 * the last event matches the given one.
 * @param {String} event
 * @param {Function} handler
 * @return {Function} middleware
 */
export function after(event, handler) {
    return function handleContext(req, next) {
        const lastHandled = last(req.context);
        return lastHandled && lastHandled.event === event ?
            handler(req, next) :
            next();
    };
}

/**
 * Middleware creator that only executes the handler when
 * the regex matches the requests context
 * @param {RegExp|String} regex
 * @param {Function} handler
 * @return {Function} middleware
 */
export function matches(regex, handler) {
    return function handleContext(req, next) {
        const string = req.context.map(e => e.event).join(':');
        return regex.test(string) ?
            handler(req, next) :
            next();
    };
}

/**
 * Middleware creator that only executes the handler when
 * the custom function returns true given the the request
 * @param {Function} shouldHandle
 * @param {Function} handler
 * @return {Function} middleware
 */
export function custom(shouldHandle, handler) {
    return function handleContext(req, next) {
        return shouldHandle(req) ?
            handler(req, next) :
            next();
    };
}
