import { Handler, NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export interface ContentSecurityPolicyMiddlewareConfiguration {
  nonce?: string; // Optional nonce value, if not provided a random UUID will be generated
  defaultSrc?: string; // Optional: default-src directive, if not provided a default will be used
  scriptSrc?: string; // Optional: script-src directive, if not provided a default will be used
  objectSrc?: string; // Optional: object-src directive, if not provided a default will be used
  baseUri?: string; // Optional: base-uri directive, if not provided a default will be used
}

const DefaultContentSecurityPolicyMiddlewareConfiguration: ContentSecurityPolicyMiddlewareConfiguration = Object.freeze({
  defaultSrc: `'self'`,
  scriptSrc: `'nonce-#{nonce}#'`,
  objectSrc: `'none'`,
  baseUri: `'none'`,
});

function getContentSecurityPolicy(config: Required<ContentSecurityPolicyMiddlewareConfiguration>): string {
  const csp = [
    `default-src ${config.defaultSrc}`,
    `script-src ${config.scriptSrc}`,
    `object-src ${config.objectSrc}`,
    `base-uri ${config.baseUri}`,
  ];

  return csp.join('; ').replace(/\#\{nonce\}\#/g, config.nonce);
}

function ContentSecurityPolicyMiddlewareImpl(config: ContentSecurityPolicyMiddlewareConfiguration = {}): Handler {
  return (request: Request, response: Response, next: NextFunction): void => {
    const nonceValue = config.nonce || randomUUID();
    response.append('Content-Security-Policy', getContentSecurityPolicy({
      ...DefaultContentSecurityPolicyMiddlewareConfiguration,
      ...config,
      nonce: nonceValue
    } as Required<ContentSecurityPolicyMiddlewareConfiguration>));
    response.locals.nonce = nonceValue;
    next();
  }
}

export default ContentSecurityPolicyMiddlewareImpl;
