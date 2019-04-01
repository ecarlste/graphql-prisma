import { GraphQLServer, PubSub } from 'graphql-yoga';
import prisma from './prisma';
import resolvers from './resolvers';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      pubsub,
      prisma,
      request
    };
  }
});

server.start(() => console.log('GraphQL server is up...'));
