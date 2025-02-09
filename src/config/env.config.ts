export const EnvConfiguration = () => ({
    port: process.env.PORT || 4001,
    database_url: process.env.DATABASE_URL || "hola",
    jwt_secret: process.env.JWT_SECRET || "EsteEsMiTextoSecretoDeRespaldo",
    limit_pagination: process.env.LIMIT_PAGINATION || 10,
    offset: process.env.OFFSET || 0,
    node_env: process.env.NODE_ENV || "development",
    duration_jwt: process.env.DURATION_JWT || "3h",
})