
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    
    Query: {
      me: async (parent, args, context) => {
        
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
          .select(['-__v -password'])

          if (!userData) throw new AuthenticationError(`No Data Returned: ${context.user._id}`)
          return userData;
        }

        throw new AuthenticationError('Not logged in!')

      },

      users: async () => {
        const users = await User.find()
        .select(['-__v -password'])

        return users;
      }


    },

    Mutation: {

        login: async (parent, { email, password }) => {
        
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
        
        

        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);

        return {token, user} ;
      },
            
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
          return { token, user };
      },    
      
    

      saveBook: async (parent, { input }, context) => {
        if (context.user) {
          const user = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: input } },
            { new: true, runValidators: true }
          );
  
          return user;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      },

      removeBook: async (parent, { bookId }, context) => {

        if (context.user) {
          const user = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: {bookId: bookId}}},
            { new: true }
          )
          return user;
        }

        throw new AuthenticationError('You need to be logged in!');
      }


    }
  };
  
  module.exports = resolvers;