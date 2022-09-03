const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Pet {
    id: ID!
    organization_id: [String]
    url: String
    type: String
    species: String
    breeds: Breed
    age: String
    gender: String
    name: String
    description: String
    photos: [Photo]
    status: String
  }

  type Photo {
    small: String
    medium: String
    large: String
    full: String
  }

  type Breed {
    primary: String
    secondary: String
    mixed: Boolean
    unknown: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    latestPets: [Pet]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
  }
`;

module.exports = typeDefs;
