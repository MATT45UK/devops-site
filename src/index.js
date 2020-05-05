require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestPerMinute: 5,
        jwksUri: process.env.AUTH0_URI
    }),
    audience: process.env.AUTH0_API_IDENTIFIER,
    algorithms: ['RS256']
});

const app = express();


app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// Load in routes for things
require('./routes/terraform.routes')(app);

app.get('/', (req, res) => {
    res.send({ title: 'DevOps' });
});

app.get('/protected', checkJwt, (req, res) => {
    res.send({ title: 'Protected' });
});

app.listen(3001, () => {
    console.log('listening on port 3001');
});