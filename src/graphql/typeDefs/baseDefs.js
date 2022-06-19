import { gql } from 'apollo-server-express'

export default gql`
    scalar Upload
    
    type Query {
        _: String!
    }

    type Mutation {
        _: String!
    }

    type Subscription {
        _: String!
    }
`;