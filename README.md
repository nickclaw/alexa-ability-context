# alexa-ability-context

Customize your responses based off of previous conversation.

### Example
```js
import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';
import { trackContext, context } from 'alexa-ability-context';

const app = new Ability({
    applicationId: 'your-app-id'
});

app.use(trackContext());

app.on('OrderPizzaIntent', function(req) {
    req.say('Are you sure you want to order pizza?').send();
});

app.on('OrderSaladIntent', function() {
    req.say('Are you sure you want to order salad?').send();
});

// only handle "AMAZON.yes" intent when responding to "OrderPizzaIntent"s questions
app.on(events.yes, context.after('OrderPizzaIntent', function(req) {
    orderPizza(function() {
        req.say('Your pizza is on its way!').end();
    });
}));

// only handle "AMAZON.yes" intent when responding to "OrderSaladIntent"s questions
app.on(events.yes, context.after('OrderSaladIntent', function(req) {
    orderSalad(function() {
        req.say('Your salad is on its way!').end();
    });
}));

app.on(events.no, function() {
    req.say('Ok, goodbye.').end();
});

export const handler = handleAbility(app);
```


### API
