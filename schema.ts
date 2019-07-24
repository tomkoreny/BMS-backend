import { gql } from 'apollo-server';

export const schema = gql`
  directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

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
    id: String
    nickName: String
    emailVerified: Boolean
    blocked: Boolean
  }

  type Workplace {
    id: Int!
    name: String!  
  }

  type Shift {
    id: Int!
    user: User!
    date: String!
    workplace: Workplace!  
  }

  type Query {
    users: [User] @auth
  }

  type Mutation {
    users: UsersMutation
    workplaces: WorlplaceMutation
  }

  type UsersMutation {
    create(input: CreateUserInput): User
    update(id: String!, input: UpdateUserInput): User
    ## TODO: addRoles(id: String!, roles: [String]): User
    ## TODO: removeRoles(id: String!, roles: [String]): User
  }

  type WorlplaceMutation {
    create(input: CreateWorkplaceInput): Workplace
    update(id: String!, input: UpdateWorkplaceInput): Workplace
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
    blocked: Boolean
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
    blocked: Boolean
  }

  input CreateWorkplaceInput {
    name: String!
  }

  input UpdateWorkplaceInput {
    name: String
  }
`;
