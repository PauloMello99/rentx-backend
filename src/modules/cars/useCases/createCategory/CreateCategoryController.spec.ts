import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import { app } from "shared/infra/http/app";
import createConnection from "shared/infra/typeorm";
import { Connection } from "typeorm";

let connection: Connection;

describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`
    INSERT INTO 
    USERS (id, name, email, password, "isAdmin", driver_license, created_at)
    VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'XXXXXX', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Test",
        description: "Category Description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to create a new category if name already exists", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({ name: "Category Test", description: "Category Description" })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toEqual(400);
  });
});
