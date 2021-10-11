import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import { app } from "shared/infra/http/app";
import createConnection from "shared/infra/typeorm";
import { Connection } from "typeorm";

let connection: Connection;

describe("List Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("admin", 8);

    await connection.query(`
    INSERT INTO 
    USERS (id, name, email, password, "isAdmin", driver_license, created_at)
    VALUES('${uuidV4()}', 'admin', 'admin@rentx.com', '${password}', true, 'XXXXXX', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    const session = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const { refresh_token } = session.body;

    await request(app)
      .post("/categories")
      .set({ authorization: `Bearer ${refresh_token}` })
      .send({ name: "Category Test", description: "Category Description" });

    const response = await request(app).get("/categories");

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name", "Category Test");
    expect(response.body[0]).toHaveProperty("description", "Category Description");
  });
});
