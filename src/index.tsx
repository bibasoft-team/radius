import './polyfills'
import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import * as Sentry from '@sentry/react'
import { ApolloProvider } from '@apollo/client'
import { App } from 'components/App'
import { client } from 'api/graphql'

import './index.scss'

if (process.env.NODE_ENV === 'production')
	Sentry.init({
		dsn: '', // TODO Add sentry dsn
		release: 'my-package@1.0', // TODO package and version
		environment: 'production', // TODO add env
	})

ReactDOM.render(
	<React.StrictMode>
		<Sentry.ErrorBoundary>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</Sentry.ErrorBoundary>
	</React.StrictMode>,
	document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
