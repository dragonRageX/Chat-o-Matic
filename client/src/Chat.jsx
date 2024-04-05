import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

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

const POST_MESSAGE = gql`
mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
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
                            <div key={id} style={{ display: "flex", justifyContent: messageUser === user ? "flex-end" : "flex-start", paddingBottom: "1em", alignItems: "center" }}>
                                { messageUser !== user && (
                                    <div style={{ height: "40px", width: "40px", marginRight: "0.5em", border: "2px solid #e5e6ea", borderRadius: "50%", fontSize: "18pt", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        { messageUser.slice(0, 2).toUpperCase() }
                                    </div>
                                ) }
                                <div style={{ background: messageUser === user ? "#58bf56" : "#e5e6ea", color: user === messageUser ? "white" : "black", padding: "1em", borderRadius: "1em", maxWidth: "60%" }}>
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
    let [state, setState] = React.useState({
        user: "Jack",
        content: ""
    });

    const [postMessage, { loading, error, data }] = useMutation(POST_MESSAGE);   //the 'data' property contains the 'ID' that is being returned by our postMessage mutation
    
    let messageState;
    function sendMessage(e)
    {
        if(state.content.length > 0)
        {
            postMessage({   //fire the mutation function
                variables: { user: state.user, content: state.content }, 
                refetchQueries: [ GET_MESSAGES ] 
            });

            if(loading)
            {
                messageState =  <p>Loading...</p>;
            }
            if(error)
            {
                messageState = <pre>Error: {error.message}</pre>;
            }

            console.log(data);

            setState((prevState) => (   //set the message content field to blank
                {
                    ...prevState,
                    content: ""
                }
            ));
        }
    }

    return (
        <div className="messages-container">
            <Messages user={state.user} />
            <div className="grid-container">
                <div className="column">
                    <InputText label="User" value={state.user} onChange={(e) => setState((prevState) => ({ ...prevState, user: e.target.value }))} type="text" className="p-inputtext-lg" placeholder="Enter Username" style={{ width: "100%", height: "40px", borderRadius: "5px", border: "1px solid lightblue", textIndent: "5px" }} />
                </div>
                <div className="column">
                    <InputText label="Content" value={state.content} onChange={(e) => setState((prevState) => ({ ...prevState, content: e.target.value }))} onKeyUp={(e) => { if(e.key === "Enter" || e.key === "Return"){ sendMessage(e); } }} type="text" className="p-inputtext-lg" placeholder="Enter Message" style={{ width: "100%", height: "40px", borderRadius: "5px", border: "1px solid lightblue", textIndent: "5px" }} />
                    {state.content.length === 0 && <Message text="Message Content is required" style={{ color: "red", background: "rgba(255, 231, 230, 0.7)", padding: "8px", marginTop: "10px" }} />}
                </div>
                <div className="column">
                    {state.content.length != 0 && <Button label="Send" onClick={(e) => sendMessage(e)} style={{ width: "100%", height: "40px", borderRadius: "5px", background: "blue", color: "white", border: "none" }} />}
                    {messageState}
                </div>
            </div>
        </div>
    );
}

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);