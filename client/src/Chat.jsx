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
        return (
            <>
                {
                    data.messages.map(({ id, user: messageUser, content }) => {
                        return (
                            <div key={id} style={{ display: "flex", justifyContent: user === messageUser ? "flex-end" : "flex-start", paddingBottom: "1em" }}>
                                <div style={{ background: user === messageUser ? "#58bf56" : "#e5e6ea", color: user === messageUser ? "white" : "black", padding: "1em", borderRadius: "1em", maxWidth: "60%" }}>
                                    {content}
                                </div>
                            </div>
                        );
                    })
                }
            </>
        );
    }
}

function Chat()
{
    return (
        <div className="messages-container">
            <Messages user="Jack" />
        </div>
    );
}

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);