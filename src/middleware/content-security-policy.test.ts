import { expect } from 'chai';
import sinon from 'sinon';
import ContentSecurityPolicyMiddleware from './content-security-policy';
import * as crypto from 'node:crypto';

type MockResponse = any & { append: sinon.SinonSpy; locals: { [key: string]: any }};
type MockUUID = `${string}-${string}-${string}-${string}-${string}`;

describe('ContentSecurityPolicyMiddleware', () => {
  let req: any;
  let res: MockResponse;
  let next: sinon.SinonSpy;
  let appendSpy: sinon.SinonSpy;
  let fakeUUID: string;

  beforeEach(() => {
    req = {};
    res = {
      append: sinon.spy(),
      locals: {}
    };
    next = sinon.spy();
    fakeUUID = 'c2e7ad28-e20c-414f-84b3-5d185661339d';
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should append the correct Content-Security-Policy header', () => {
    const middleware = ContentSecurityPolicyMiddleware({ nonce: fakeUUID});
    middleware(req, res, next);

    expect(res.append.calledOnce).to.be.true;
    const [headerName, headerValue] = res.append.firstCall.args;
    expect(headerName).to.equal('Content-Security-Policy');
    expect(headerValue).to.include(`script-src 'nonce-${fakeUUID}'`);
    expect(headerValue).to.include(`default-src 'self'`);
    expect(headerValue).to.include(`object-src 'none'`);
    expect(headerValue).to.include(`base-uri 'none'`);
  });

  it('should set the nonce on response.locals', () => {
    const middleware = ContentSecurityPolicyMiddleware({ nonce: fakeUUID });
    middleware(req, res, next);

    expect(res.locals.nonce).to.equal(fakeUUID);
  });

  it('should call next()', () => {
    const middleware = ContentSecurityPolicyMiddleware();
    middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
  });
});
