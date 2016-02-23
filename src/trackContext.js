import get from 'lodash/get';

export function trackContext({
    key = '__context__',
} = {}) {
    // return middleware
    return function contextMiddleware(req, next) {
        // self aware
        if (req.context) {
            return next();
        }

        // get current context
        const context = get(req, `raw.session.attributes.${key}`, []);
        const now = { event: req.handler };
        req.context = context;

        // before the request sends update the __context__ property in the session
        req.on('finished', () => req.session[key] = [...context, now]);
        next();
    };
}
