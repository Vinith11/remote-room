import { ApolloClient, InMemoryCache } from "@apollo/client";
import config from "../aws-exports";

const client = new ApolloClient({
  uri: config.aws_appsync_graphqlEndpoint,
  cache: new InMemoryCache(),
  headers: {
    "x-api-key": config.aws_appsync_apiKey,
  },
});

export default client;