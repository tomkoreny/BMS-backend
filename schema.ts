import { gql } from 'apollo-server';

export const schema = gql`
directive @auth(
  requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  REVIEWER
  USER
  UNKNOWN
}
  type User {
    email: String
    name: String
    firstName: String
    lastName: String
    pictureUrl: String
    locale: String
    updatedAt: String
    createdAt: String
    lastLogin: String
    lastIp: String
    loginCount: String
    userId: String
    nickName: String
    emailVerified: Boolean
  }

  type Query {
    users: [User] @auth
  }

  type Mutation {
    users: UsersMutation
  }

  type UsersMutation {
      create(input: CreateUserInput): User
      update(id: String!, input: UpdateUserInput): User
      ## TODO: addRoles(id: String!, roles: [String]): User
      ## TODO: removeRoles(id: String!, roles: [String]): User

  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    userName: String
    email: String
    password: String
    emailVerified: Boolean
    textColor: String
    bgColor: String
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    password: String
    emailVerified: Boolean!
    textColor: String
    bgColor: String
  }
`;
