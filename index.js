const { ApolloGateway } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");

const port = 4000;
const app = express();

const gateway = new ApolloGateway({
  serviceList: [{ name: "accounts", url: "http://localhost:4001" }],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
});
