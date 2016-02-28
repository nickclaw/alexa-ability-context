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

        // functions to modify context behavior
        let shouldSave = true;
        const skipContext = () => { shouldSave = false };
        const destroyContext = () => { this.splice(0, this.length) };
        const now = { event: req.handler };


        // prepare current context
        const context = clone(get(req, `raw.session.attributes.${key}`, []));
        Object.defineProperty(context, 'destroy', { value: destroyContext });
        Object.defineProperty(context, 'skip', { value: skipContext });
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
