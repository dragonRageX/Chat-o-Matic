const { createServer } = require('node:http');
const { createYoga, createSchema } = require('graphql-yoga');

const messages = [];

//Every GraphQL Server needs a Schema i.e. a type (like in a Node server we define a MongoDB Schema for framing the data in a certain format). We first make the Schema for a Message entity/table/collection 
const schema = createSchema({
    typeDefs: `   
        type Message {
            id: ID!
            user: String!
            content: String!
        }
    
        type Query {
            messages: [Message!]
        }

        type Mutation {
            postMessage(user: String!, content: String!): ID!
        }
    `,  //The '!' mark suggests that the field is required. The Query type stores all the Message objects inside an array. The Query type is like a GET request in the REST framework. The Mutation type is like a POST request in the REST framework.
    
    resolvers: {   //resolvers are the implementation of the typeDefs, like a Model of the Schema
        Query: {
            messages: () => messages,
        },
        Mutation: {
            postMessage: (parent, { user, content }) => {
                const id = messages.length;
                messages.push({ id: id, user: user, content: content });
                return id;
            }
        }
    }
});

const yoga = createYoga({ schema });

const server = createServer(yoga);

server.listen(4000, () => {
    console.info("Server started on http://localhost:4000/graphql"); 
});   // http://localhost:4000/graphql - This link opens up a GraphiQL GUI.
    //A sample GraphiQL Query type - 
    // query {
    //     messages {
    //       id
    //       content
    //       user
    //     } 
    // }