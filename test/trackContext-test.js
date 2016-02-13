import { Ability } from 'alexa-ability';
import { trackContext } from '../src/trackContext';
import intentRequest from './fixtures/intent-request';

describe('trackContext', function() {

    let app = null;
    beforeEach(function() {
        app = new Ability({ applicationId: intentRequest.session.application.applicationId });
    });

    it('should return a middleware function', function() {
        const middleware = trackContext();
        expect(middleware).to.be.instanceOf(Function);
        expect(middleware.length).to.equal(2);
    });

    describe('middleware function', function() {

        it('should attach a "context" property to the request', function() {
            app.use(trackContext());
            const req = app.handle(intentRequest);
            expect(req.context).to.deep.equal(intentRequest.session.attributes.__context__);
        });

        it('should honor the "key" option', function() {
            app.use(trackContext({ key: '__custom__' }));
            const req = app.handle(intentRequest);
            expect(req.context).to.deep.equal(intentRequest.session.attributes.__custom__);
        });

        it('should append the handler to the context before being sent', function() {
            app.use(trackContext({ key: '__custom__' }));
            app.on('GetZodiacHoroscopeIntent', req => req.end());
            app.handle(intentRequest, function(err, req) {
                expect(req.context.length).to.equal(4);
                expect(req.context[3]).to.equal('GetZodiacHoroscopeIntent');
            });
        });
    });
});
