import { KeyFieldsFunction } from '@apollo/client/cache/inmemory/policies'

const filterKeyArgsToArgs = (keyArgs: any) => (args: any) =>
	args ? keyArgs.filter((keyArg: any) => args.hasOwnProperty(keyArg)) : null

export function offsetLimitPagination(keyArgs?: string[] | KeyFieldsFunction | false) {
	return {
		keyArgs: keyArgs ? filterKeyArgsToArgs(keyArgs) : (false as const),
		merge: function (existing, incoming, _a) {
			var args = _a.args
			if (args.offset === undefined) return incoming

			var merged = existing ? existing.slice(0) : []
			var start = args ? args.offset : merged.length
			var end = start + incoming.length
			for (var i = start; i < end; ++i) {
				merged[i] = incoming[i - start]
			}
			return merged
		},
	}
}
