import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
query {
    messages {
      id
      content
      user
    } 
  }
`;

function Messages({ user })
{
    const { loading, error, data } = useQuery(GET_MESSAGES);

    if(loading)
    {
        return <p>Loading...</p>;
    }
    if(error)
    {
        return <pre>Error: {error.message}</pre>;
    }
    else
    {
        return JSON.stringify(data);
    }
}

function Chat()
{
    return (
        <div>
            <Messages user="Jack" />
        </div>
    );
}

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
)