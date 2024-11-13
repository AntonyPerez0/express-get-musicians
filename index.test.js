const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician } = require("./models/index");
const app = require("./src/app");
const { seedMusician } = require("./seedData");

describe("./musicians endpoint", () => {
  test("GET /musicians should return all musicians", async () => {
    const response = await request(app).get("/musicians");
    expect(response.statusCode).toBe(200);
    const responseData = response.body;
    expect(Array.isArray(responseData)).toBe(true);
    expect(responseData.length).toBeGreaterThan(0);
    expect(responseData[0]).toHaveProperty("name");
    expect(responseData[0]).toHaveProperty("instrument");
  });

  test("GET /musicians/:id should return a musician by ID", async () => {
    const response = await request(app).get("/musicians/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("instrument");
  });

  test("GET /musicians/:id should return 404 if musician not found", async () => {
    const response = await request(app).get("/musicians/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("POST /musicians should create a new musician", async () => {
    const newMusician = { name: "Ludwig van Beethoven", instrument: "Piano" };
    const response = await request(app).post("/musicians").send(newMusician);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newMusician.name);
    expect(response.body.instrument).toBe(newMusician.instrument);
  });

  test("PUT /musicians/:id should update an existing musician", async () => {
    const updatedMusician = {
      name: "Johann Sebastian Bach",
      instrument: "Organ",
    };
    const response = await request(app)
      .put("/musicians/1")
      .send(updatedMusician);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedMusician.name);
    expect(response.body.instrument).toBe(updatedMusician.instrument);
  });

  test("DELETE /musicians/:id should delete a musician", async () => {
    const response = await request(app).delete("/musicians/1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Musician deleted");
  });
});

afterAll(async () => {
  await db.close();
});
