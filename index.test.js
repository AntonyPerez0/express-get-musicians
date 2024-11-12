// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician } = require("./models/index");
const app = require("./src/app");
const { seedMusician } = require("./seedData");

describe("./musicians endpoint", () => {
  // Write your tests here
  test("GET /musicians should return all musicians", async () => {
    const response = await request(app).get("/musicians");
    expect(response.statusCode).toBe(200);
    const responseData = response.body;
    expect(Array.isArray(responseData)).toBe(true);
    expect(responseData.length).toBeGreaterThan(0);
    expect(responseData[0]).toHaveProperty("name");
    expect(responseData[0]).toHaveProperty("instrument");
  });
  test("should return a musician by ID", async () => {
    const response = await request(app).get("/musicians/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("instrument");
  });

  test("should return 404 if musician not found", async () => {
    const response = await request(app).get("/musicians/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
