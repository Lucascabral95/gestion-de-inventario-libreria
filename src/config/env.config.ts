export const EnvConfiguration = () => ({
    port: process.env.PORT || 4000,
    database_url: process.env.DATABASE_URL || "postgresql://neondb_owner:bRafKMY86tmE@ep-cool-snowflake-a5yz0492.us-east-2.aws.neon.tech/neondb?sslmode=require",
    jwt_secret: process.env.JWT_SECRET || "EsteEsMiTextoSecretoEIndecifrable",
    limit_pagination: process.env.LIMIT_PAGINATION || 10,
    offset: process.env.OFFSET || 0,
    node_env: process.env.NODE_ENV || "development",
    duration_jwt: process.env.DURATION_JWT || "240h",
})