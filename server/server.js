const { GraphQLServer } = require("graphql-yoga");

const server = new GraphQLServer();

//Every GraphQL Server needs a Schema i.e. a type (like in a Node server we define a MongoDB Schema for framing the data in a certain format). We first make the Schema for  
const typeDefs = `   
    type Message {
        id: ID!
        user: String!
    }
`

server.start(({ port }) => {
    console.log(`Server started on http://localhost:${port}/`);
});