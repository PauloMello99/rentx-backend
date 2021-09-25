import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (hostName = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  const host = process.env.NODE_ENV === "test" ? "localhost" : hostName;
  const database = process.env.NODE_ENV === "test" ? "rentx_test" : defaultOptions.database;

  return createConnection(Object.assign(defaultOptions, { host, database }));
};
