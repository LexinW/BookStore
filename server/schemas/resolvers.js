const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        return user;
      }
      throw new AuthenticationError('You are not logged in');
    },
    getUser: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        throw new Error('Error fetching user by ID');
      }
    },
    getAllUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error('Error fetching all users');
      }
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user);
      return { token, user };
    },
    createUser: async (_, { userInput }) => {
      try {
        const newUser = await User.create(userInput);
        const token = signToken(newUser);
        return { token, user: newUser };
      } catch (error) {
        throw new Error('Error creating user');
      }
    },
    updateUser: async (_, { userId, userInput }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(userId, userInput, { new: true });
        return updatedUser;
      } catch (error) {
        throw new Error('Error updating user');
      }
    },
    deleteUser: async (_, { userId }) => {
      try {
        await User.findByIdAndRemove(userId);
        return 'User deleted successfully';
      } catch (error) {
        throw new Error('Error deleting user');
      }
    },
    saveBook: async (_, { bookInput }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedBooks: bookInput } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You are not logged in');
    },
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You are not logged in');
    },
  },
};

module.exports = resolvers;
