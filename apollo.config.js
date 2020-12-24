require('dotenv-flow').config({})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = {
    client: {
        service: {
            name: "secure",
            url: process.env.REACT_APP_GRAPHQL_HOST,
            headers: {
                SCHEMA_AUTH: process.env.REACT_APP_GRAPHQL_SCHEMA_KEY,
            },
        },
        includes: ["./src/api/graphql/**/*.graphql"],
        excludes: ["./src/api/graphql/generated/**/*.*"],
    }
};