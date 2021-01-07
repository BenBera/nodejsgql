import express from "express";
import consola from "consola";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { ApolloServer } from "apollo-server-express";

import { DB, IN_PROD, APP_PORT } from "./config/index";

//Initializing the App
const app = express();

//setting up middlewares
app.disable("x-powered-by");

//Starting Apollo-Express-server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: IN_PROD
    ? false
    : {
        settings: {
          "request.credentials": "include",
        },
      },
});

//Start Application Function
const startApp = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    consola.success({
      message: `successfully connceted with Database \n${DB}`,
      badge: true,
    });
    server.applyMiddleware({ app, cors: false });
    app.listen({ port: APP_PORT }, () =>
      consola.success({
        message: `ApolloServer Started on \n http:localhost:${APP_PORT}${server.graphqlPath}`,
        badge: true,
      })
    );
  } catch (error) {
    consola.success({
      message: `unable to start the server \n${error.message}`,
      badge: true,
    });
  }
};
startApp();
