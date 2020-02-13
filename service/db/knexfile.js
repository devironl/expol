module.exports = {
  client: "pg",
  connection: {
    host:
      process.env.NODE_ENV === "production"
        ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
        : "postgres",
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD
  },
  migrations: {
    directory: "./db/migrations"
  }
};
