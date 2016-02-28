import get from 'lodash/get';
import clone from 'lodash/clone';

export function trackContext({
    key = '__context__',
    property = 'context',
} = {}) {
    // return middleware
    return function contextMiddleware(req, next) {
        // self aware
        if (req[property]) {
            return next();
        }

        // prepare current context
        const context = clone(get(req, `raw.session.attributes.${key}`, []));
        let shouldSave = true;
        const now = { event: req.handler };
        Object.defineProperty(context, 'destroy', {
            value: () => { context.splice(0, context.length); },
        });
        Object.defineProperty(context, 'skip', {
            value: () => { shouldSave = false; },
        });
        Object.defineProperty(context, 'now', { value: now });
        req[property] = context;


        // before the request sends, update the context in the session
        req.on('finished', () => {
            const newContext = clone(context);

            if (shouldSave) {
                newContext.push(now);
            }

            req.session[key] = newContext;
        });
        next();
    };
}
