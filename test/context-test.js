import * as context from '../src/context';
import noop from 'lodash/noop';

const req = { context: [
    { event: 'bar' },
    { event: 'foo' }
] };

describe('context object', function() {

    it('should have all the matching function', function() {
        expect(context).to.have.keys(['after', 'matches', 'custom']);
    });

    describe('after function', function() {
        it('should return a handler function', function() {
            const handler = context.after('foo', req => req.end());
            expect(handler).to.be.instanceOf(Function);
            expect(handler.length).to.equal(2);
        });

        it('should not call the handler if it doesnt match', function() {
            const spy = sinon.spy();
            const next = sinon.spy();

            const handler = context.after('bat', spy);
            handler(req, next);
            expect(spy).to.not.be.called;
            expect(next).to.be.called;
        });

        it('should call the handler function if it does match', function() {
            const spy = sinon.spy();
            const next = sinon.spy();

            const handler = context.after('foo', spy);
            handler(req, next);
            expect(spy).to.be.calledWith(req, next);
            expect(next).to.not.be.called;
        });
    });

    describe('matches function', function() {
        it('should return a handler function', function() {
            const handler = context.matches(/foo/, req => req.end());
            expect(handler).to.be.instanceOf(Function);
            expect(handler.length).to.equal(2);
        });

        it('should not call the handler if it doesnt match', function() {
            const spy = sinon.spy();
            const next = sinon.spy();

            const handler = context.matches(/bar:bat/, spy);
            handler(req, next);
            expect(spy).to.not.be.called;
            expect(next).to.be.called;
        });

        it('should call the handler function if it does match', function() {
            const spy = sinon.spy();
            const next = sinon.spy();

            const handler = context.matches(/bar:foo/, spy);
            handler(req, next);
            expect(spy).to.be.calledWith(req, next);
            expect(next).to.not.be.called;
        });
    });

    describe('custom function', function() {
        it('should return a handler function', function() {
            const handler = context.after(noop, req => req.end());
            expect(handler).to.be.instanceOf(Function);
            expect(handler.length).to.equal(2);
        });

        it('should not call the handler if it doesnt match', function() {
            const check = sinon.spy(req => false);
            const spy = sinon.spy();
            const next = sinon.spy();

            const handler = context.custom(check, spy);
            handler(req, next);
            expect(check).to.be.calledWith(req);
            expect(spy).to.not.be.called;
            expect(next).to.be.called;
        });

        it('should call the handler function if it does match', function() {
            const check = sinon.spy(req => true);
            const spy = sinon.spy();
            const next = sinon.spy();

            const handler = context.custom(check, spy);
            handler(req, next);
            expect(check).to.be.calledWith(req);
            expect(spy).to.be.calledWith(req, next);
            expect(next).to.not.be.called;
        });
    });
});
