//copy from https://github.com/aerogear/offix/blob/master/packages/offix/cache/src/utils/helperFunctions.ts
import * as Apollo from '@apollo/client'
import { OperationVariables } from '@apollo/client'
import { resultKeyNameFromField } from '@apollo/client/utilities'
import { OperationDefinitionNode, FieldNode, DocumentNode } from 'graphql'

// TODO refactoring

export interface QueryWithVariables {
	query: DocumentNode
	variables?: OperationVariables
}

export type CacheUpdatesQuery = QueryWithVariables | DocumentNode

type TEdge<K> = {
	__typename: string //"StoreCourseEdge"
	node: K
}

type TRelay<K> = {
	edges: Array<TEdge<K>>
}

type TResult<T> = Record<keyof T, Record<keyof T[keyof T], TRelay<T[keyof T]>> | TRelay<T[keyof T]>>

export const getMutationName = (mutation: DocumentNode) => {
	const definition = mutation.definitions.find(def => def.kind === 'OperationDefinition')
	const operationDefinition = definition && (definition as OperationDefinitionNode)
	return operationDefinition && operationDefinition.name && operationDefinition.name.value
}
export const getOperationFieldName = (operation: DocumentNode): string =>
	resultKeyNameFromField(
		(operation.definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode,
	)
// this function takes a Query and returns its constituent parts, if available.
export const deconstructQuery = (updateQuery: CacheUpdatesQuery): QueryWithVariables => {
	let query: DocumentNode
	let variables: OperationVariables | undefined
	if (isQueryWithVariables(updateQuery)) {
		query = updateQuery.query
		variables = updateQuery.variables
	} else {
		query = updateQuery
	}
	return { query, variables }
}
const isQueryWithVariables = (doc: CacheUpdatesQuery): doc is QueryWithVariables => {
	if ((doc as QueryWithVariables).variables) {
		return true
	} else {
		return false
	}
}

const generateEdge = (node: object & { __typename: string }) => {
	return { __typename: node.__typename + 'Edge', node }
}

const getQueryField = (query: any, queryName: string, field?: string | ((q: string) => object)) => {
	if (!field) return query[queryName]

	if (typeof field === 'string') return query[queryName][field]

	return field(query[queryName])
}

const modifyEdges = <K extends object & { __typename: string; id: number }>(
	edges: Array<TEdge<K>>,
	data: K,
	operation: 'add' | 'delete' | 'update',
	add: 'append' | 'prepend',
) => {
	const data_array = Array.isArray(data) ? data.map(d => generateEdge(d)) : [generateEdge(data)]
	switch (operation) {
		case 'add': {
			return add === 'prepend' ? [...data_array, ...edges] : [...edges, ...data_array]
		}
		case 'delete': {
			return edges.filter(e => e.node.id !== data.id)
		}
		case 'update': {
			// TODO support arrays
			return edges.some(e => e.node.id === data.id)
				? edges.map(e => (e.node.id === data.id ? { ...e, node: { ...e.node, ...data } } : e))
				: add === 'prepend'
				? [...data_array, ...edges]
				: [...edges, ...data_array]
		}
	}
}

export const updateRelay = <T extends { [key: string]: any }, K extends keyof T = keyof T>(
	mutationName: K,
	updateQuery: CacheUpdatesQuery,
	operation: 'delete' | 'add' | 'update',
	field?: string | ((q: any) => object),
	variables?: Record<string, any>,
	add: 'append' | 'prepend' = 'prepend',
) => (cache: Apollo.ApolloCache<T>, { data }: Apollo.FetchResult<T>) => {
	const { query } = deconstructQuery(updateQuery)
	const rootField = getOperationFieldName(query)
	if (!data || !data[mutationName]) return

	let existingResult: TResult<T> | {}
	try {
		existingResult = cache.readQuery({ query, variables }) || {}
	} catch (e) {
		existingResult = {}
		console.error(e)
	}

	const operationData = data[mutationName]

	let edges = (getQueryField(existingResult, rootField, field) as TRelay<T>)?.edges || []
	const newEdges = modifyEdges(edges as any, operationData, operation, add)

	let newResult = JSON.parse(JSON.stringify(existingResult))
	getQueryField(newResult, rootField, field).edges = newEdges

	try {
		cache.writeQuery({
			query,
			variables,
			data: newResult,
		})
	} catch (err) {
		console.error(err)
	}
}
