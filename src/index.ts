import express from 'express';
import ContentSecurityPolicyMiddlewareImpl from './middleware/content-security-policy';

const ContentSecurityPolicyMiddleware = express();
ContentSecurityPolicyMiddleware.use(ContentSecurityPolicyMiddlewareImpl());
export default ContentSecurityPolicyMiddleware;
