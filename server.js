if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('apollo-server-express');
const { verify } = require('jsonwebtoken');
const helment = require('helmet');

// Provide schemas for apollo server
const typeDefs = require('./server/schemas/index');

// Provide resolver functions for your schema fields
const resolvers = require('./server/resolvers/index');

(async () => {
  // initialize server
  const app = express();
  app.use(helment());
  const allowedOrigin = process.env.CORS_URL
    ? process.env.CORS_URL.split(',')
    : [''];

  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.applyMiddleware({
    app,
    cors: false,
  });

  const httpServer = http.createServer(app);

  server.installSubscriptionHandlers(httpServer);
  const ipaddr = process.env.IP || 'localhost';
  const PORT = Number(process.env.PORT) || 4001;

  httpServer.listen({ port: PORT }, async () => {
    console.log(
      `🚀 GraphQL Server ready at http://${ipaddr}:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 GraphQL Subscriptions ready at ws://${ipaddr}:${PORT}${server.subscriptionsPath}`
    );
    // migrate and seed database and add initial user
    (async () => {
      // await migrateDatabase();
      // await seedDatabase();
      // await createInitialUser({ db });
    })();
  });
})();
