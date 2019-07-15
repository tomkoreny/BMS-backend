import * as express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as flashheart from 'flashheart';
import { ApolloServer } from 'apollo-server-express';
import { AuthDirective } from './auth/authDirective';
import { schema } from './schema'; 
import {UsersResolver, UsersMutation} from './resolvers/users';

// LOAD ENV VARIABLES FROM .env FILE
require("dotenv").config();

const AUTH0_API_URL = process.env.AUTH0_URL + '/api/v2/';
const AUTH0_TOKEN_URL = process.env.AUTH0_URL + '/oauth/token';



let rest: {client: flashheart.RestClient, options: any, managementApi: any};
rest = {
client : flashheart.createClient(),
options: {},
  managementApi: null,
}

class ManagementApi {
  baseUri = AUTH0_API_URL;
  rest = rest
  async sendGet (url: string) {
  return await rest.client.get(this.baseUri + url, this.rest.options); 
  }
  async patch (url: string, body: any) {
  return await rest.client.patch(this.baseUri + url, body, this.rest.options); 
  }
  async post (url: string, body: any) {
  return await rest.client.post(this.baseUri + url, body, this.rest.options); 
  }
}


// GET AUTH0 management token
// TODO: More elegant way to obtain token for auth0 management
rest.client.post(AUTH0_TOKEN_URL,
  {
    "client_id": process.env.AUTH0_API_CLIENT_ID,
    "client_secret": process.env.AUTH0_API_CLIENT_SECRET,
    "audience": AUTH0_API_URL,
    "grant_type": "client_credentials",
  } ,
  { headers: { 'content-type': 'application/json' } })
  .then(resp => {
    rest.options = 
      { headers: { authorization: 'Bearer ' + resp.body['access_token'] } };

    rest.managementApi.rest.options = rest.options;
  })
  .catch( e => console.error(e) );


rest.managementApi = new ManagementApi();


const resolvers = {
  Query: {
    users: UsersResolver,
  },
  Mutation: {
    users: UsersMutation, 
  }
};

const server = new ApolloServer({ 
  typeDefs: schema,
  resolvers,
  mocks: process.env.MOCKS === 'TRUE',
  schemaDirectives: {
    auth: AuthDirective,
  },
  context: (req) => {
    return {
      user: req.req['user'],
      authApi: rest.managementApi,
    }
  }

});


// Create a new Express app
const app = express();

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_URL}/.well-known/jwks.json`
  }),

  audience: process.env.AUTH0_AUDIENCE,
  issuer: `${process.env.AUTH0_URL}/`,
  algorithm: ["RS256"]
});

// SKIP CORS TODO: PROPER CORS
app.use(function(_ , res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

if (process.env.SKIP_AUTH !== 'TRUE')
  app.use(checkJwt);

server.applyMiddleware({ app });

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
