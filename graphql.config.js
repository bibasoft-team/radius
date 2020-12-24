require('dotenv-flow').config({})


module.exports = {
    documents: ["./src/api/graphql/**/*.graphql"],
    extensions: {
        endpoints: {
            default: {
                url: process.env.REACT_APP_GRAPHQL_HOST,
                headers: {
                    SCHEMA_AUTH: process.env.REACT_APP_GRAPHQL_SCHEMA_KEY,
                }
            },
        },
    }
}