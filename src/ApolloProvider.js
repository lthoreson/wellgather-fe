import React from "react";
import App from "./App";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { setContext } from 'apollo-link-context'

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken')
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const httpLink = new HttpLink({
    uri: 'http://localhost:5000'
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)