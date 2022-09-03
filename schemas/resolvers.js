const petfinder = require("@petfinder/petfinder-js");

const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

require("dotenv").config();
const apiKey = process.env.PET_FINDER_API_KEY;
const secret = process.env.PET_FINDER_SECRET;
const client = new petfinder.Client({ apiKey, secret });

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    latestPets: async (parent, args, context) => {
      const results = await client.animal.search();
      console.log(results);
      return results.data.animals;
    },
  },

  User: {
    favoritesData: async (parent, args, context) => {
      const favs = parent.favorites;
      console.log(favs);
      // return [];
      if (!favs.length) {
        return [];
      }
      const promises = favs.map((id) => client.animal.show(id));
      const responses = await Promise.all(promises);
      const data = responses.map((resp) => {
        return resp.data.animal;
      });
      return data;
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
