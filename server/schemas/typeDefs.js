const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    },
    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    } 
    type Auth {
        token: String
        user: User
    }
    input BookInput {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Query {
        me: User
        getUser(userId: ID!): User
        getAllUsers: [User]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        createUser(username: String!, email: String!, password: String!): Auth
        updateUser(userId: ID!, userInput: UserInput!): User
        deleteUser(userId: ID!): String
        saveBook(bookInput: BookInput!): User
        removeBook(bookId: String!): User
    }

    input UserInput {
        username: String
        email: String
        password: String
    }
`;

module.exports = typeDefs;
