import {
  Connection,
  createConnection as createTypeORMConnection,
  getConnectionOptions,
} from "typeorm";

async function createConnection(hostName = "database"): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  const host = process.env.NODE_ENV === "test" ? "localhost" : hostName;
  const database = process.env.NODE_ENV === "test" ? "rentx_test" : defaultOptions.database;

  return createTypeORMConnection(Object.assign(defaultOptions, { host, database }));
}

export default createConnection;
