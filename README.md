# alexa-ability-context [![Build Status](https://travis-ci.org/nickclaw/alexa-ability-context.svg?branch=master)](https://travis-ci.org/nickclaw/alexa-ability-context)

Simplify building multistep conversations with context-aware intent handling.

### Example
```js
import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';
import { trackContext, context } from 'alexa-ability-context';

// create ability
const app = new Ability({
    applicationId: 'your-app-id'
});


// add middleware to track context
app.use(trackContext());


app.on('OrderPizzaIntent', function(req) {
    req.say('Are you sure you want to order pizza?').send();
});


// check against previous event
app.on(events.yes, context.after('OrderPizzaIntent', function(req) {
    req.say('Are you really really sure?').send();
}));


// do more complex checks with a regex
app.on(events.yes, context.matches(/.*OrderPizzaIntent:AMAZON.YesIntent$/, function(req) {
    orderPizza(function() {
        req.say('Your pizza is on its way!').end();
    });
}));

app.on(events.no, function() {
    req.say('Ok, goodbye.').end();
});

export const handler = handleAbility(app);
```


### API

#### `trackContext(options) -> middleware`
A middleware factory that takes an optional `options` object. The currently supported
options are:
 - `key`: defaults to `__context__`, the session key to store the context between requests.
 - `property`: defaults `context`, the property to expose the context object as on the request.

#### `req.context`
The `trackContext` middleware will add an additional property to the request object called
`context`. Which will look something like this:

```json
[
    { "event": "launch" },
    { "event": "ExampleIntent" }
]
```

##### `req.context.destroy()`

##### `req.context.skip()`

##### `req.context.now`

#### `context`

##### `context.after(event, handler) -> handler`
Creates a new handler function that only executes when the previous intent matches.

The two arguments are:
 - `event`: an event name
 - `handler`: a standard alexa-ability handler that accepts `req` and `next` as arguments.

The string the regex will be tested against will look like this:

 > FirstIntent:SecondIntent:ThirdIntent

##### `context.matches(regex, handler) -> handler`
Creates a new handler function that only executes when the conversation context matches
the given regular expression.

The two arguments are:
 - `regex`: a regular expression.
 - `handler`: a standard alexa-ability handler that accepts `req` and `next` as arguments.

##### `context.custom(fn, handler) -> handler`
Creates a new handler function that only executes when the custom `fn` returns a `true`.

The two arguments are:
 - `fn`: a function that takes in the request object and returns `true` or `false`.
 - `handler`: a standard alexa-ability handler that accepts `req` and `next` as arguments.
