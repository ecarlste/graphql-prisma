import { extractFragmentReplacements } from 'prisma-binding';
import Comment from './Comment.resolver';
import Mutation from './Mutation.resolver';
import Post from './Post.resolver';
import Query from './Query.resolver';
import Subscription from './Subscription.resolver';
import User from './User.resolver';

const resolvers = {
  Comment,
  Mutation,
  Post,
  Query,
  Subscription,
  User
};

export const fragmentReplacements = extractFragmentReplacements(resolvers);

export default resolvers;
