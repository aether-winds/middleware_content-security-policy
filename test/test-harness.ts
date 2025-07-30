import express from 'express';
import ContentSecurityPolicyMiddlware from '../src/index';

const app = express();
app.use(ContentSecurityPolicyMiddlware);
app.get('/', (_, res) => res.send('OK'));
app.listen(3000);
