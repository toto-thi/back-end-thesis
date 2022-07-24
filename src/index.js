import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from "body-parser";
import AuthMiddleware from "./middleware/is-auth";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress";

import { ApolloServer } from "apollo-server-express";
import { success, error } from "consola";
import { join } from "path";
import { typeDefs, resolvers } from "./graphql";

const app = express();
require("dotenv").config();

app.disable("x-powered-by");
app.use(cors());
app.use(AuthMiddleware);
app.use(bodyParser.json());
app.use(express.static(join(__dirname, "./uploads")));

const startApp = async () => {
  try {
    mongoose.connect(process.env.DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      // csrfPrevention: true,
      // playground: process.env.MODE, // need some change later
      context: ({ req }) => {
        const { isAuth, userId } = req;
        return {
          req,
          isAuth,
          userId,
        };
      },
    });

    app.use(graphqlUploadExpress());

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(process.env.PORT, () => {
      success({
        badge: true,
        message: `🚀 Server started on port ${process.env.PORT}`,
      });
    });
  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

startApp();
