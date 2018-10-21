const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// import environment variables and mongoose models
require('dotenv').config({ path: 'variables.env' });

const User = require('./models/User');
const Post = require('./models/Post');

// connect to Mlab Database
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('Db connected'))
  .catch(err => console.error(err));

// verify jwt passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      throw new AuthenticationError(
        'Your session has ended.  Please sign in again.'
      );
    }
  }
};

// Create Apollo/GQL server using type defs, resolvers, context (models)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return { User, Post, currentUser: await getUser(token) };
  }
});
// server listening
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
