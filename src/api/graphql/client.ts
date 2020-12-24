import { ApolloClient, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import cache from './cache'

// https://www.apollographql.com/blog/graphql-file-uploads-with-react-hooks-typescript-amazon-s3-tutorial-ef39d21066a2/
const httpLink = createUploadLink({
	uri: '/api/graphql/', // # TODO add graphql link
})

const authLink = setContext(({ context }, { headers }) => {
	// get the authentication token from local storage if it exists
	if (context?.skipAuth) return

	const token = localStorage.getItem('token')
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Token ${token}` : '',
		},
	}
})

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path }) =>
			console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
		)
		return
	}
	// don't work in IE (classic)
	//https://stackoverflow.com/questions/28117242/ie10-interprets-status-codes-401-403-as-network-error/28148022
	if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
		// remove cached token on 401 from the server
		if (!!localStorage.getItem('token')) console.log('logout')
		return
	}

	if (networkError) console.warn(`[Network error]: ${networkError}`)
})

const client = new ApolloClient({
	link: from([authLink, errorLink]).concat(httpLink),
	cache,
})

export { client, cache }
