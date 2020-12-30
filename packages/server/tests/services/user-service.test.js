import request from "supertest";
import faker from "faker";
import app from "../../src/app";
import models from "../../src/models/data-models";
import { closeDatabase, connect, clearDatabase } from "./db-handler";

/**
 * Connect to a new in-memory database before running any tests.
 */

const { User, Post } = models;
beforeAll(async () => {
  console.log("connected");
  await connect();
});

/**
 * Clear all test data after every test.
 */
// afterEach(async () => {
//   clearDatabase();
// });

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await closeDatabase();
});

describe("Authentication test suite", () => {
  const name = faker.name.findName();
  const email = faker.internet.email();

  // create user

  test("POST/ should not register user with invalid email", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name, email: "invalidmail", password: "123456" });

    expect(res.statusCode).toBe(400);
  });

  test("POST/ should not register user with short password", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name, email: "invalidmail", password: "12345" });

    expect(res.statusCode).toBe(400);
  });

  test("POST/ Register User", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name, email, password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("verification url sent to your mail");
  });

  test("POST/ should verify the user", async () => {
    const user = await User.findOne({ email });
    const res = await request(app)
      .post("/api/users/verify")
      .send({ email: user.email, emailToken: user.emailToken });

    const { token } = res.body;

    expect(res.statusCode).toBe(200);

    expect(token).not.toBe(null);
  });

  test("POST/ should not register user with duplicate email", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name, email, password: "12345" });

    expect(res.statusCode).toBe(400);
  });

  test("POST/ should return a success message if reset token is sent", async () => {
    const res = await request(app).post("/api/users/forget").send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("reset url sent to your mail");
  });

  test("POST/ should thrown an error if token is invalid or expired", async () => {
    const res = await request(app).post("/api/users/reset").send({
      password: "123456",
      confirmPassword: "123456",
      resetToken: "dummyToken",
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST/ should return a success message if password reset successfully", async () => {
    const user = await User.findOne({ email });
    const res = await request(app).post("/api/users/reset").send({
      password: "123456",
      confirmPassword: "123456",
      resetToken: user.resetToken,
    });
    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe("Password has been changed");
  });

  test("POST/ should throw an error if email is not in the db", async () => {
    const res = await request(app)
      .post("/api/users/sendVerification")
      .send({ email: "john@gmail.com" });

    expect(res.statusCode).toBe(404);
  });

  test("POST/ should send a verification email", async () => {
    const res = await request(app)
      .post("/api/users/sendVerification")
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("verification url sent to your mail");
  });

  test("POST/ should not be logged in with invalid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email,
      password: "1234567",
    });

    expect(res.statusCode).toBe(400);
  });

  test("POST/ should login the user", async () => {
    const res = await request(app).post("/api/users/login").send({
      email,
      password: "123456",
    });
    const { token } = res.body;
    expect(res.statusCode).toBe(200);
    expect(token).not.toBe(null);
  });

  // Create Post
  test("POST/ should create a post", async () => {
    // login to get token
    const res = await request(app).post("/api/users/login").send({
      email,
      password: "123456",
    });

    const { token } = res.body;

    const response = await request(app)
      .post("/api/posts")
      .send({
        title: "I wanna sell this book",
        description: "lorem ipsum dollar emmet",
        price: "500",
        type: "sell",
        name: "lilkhata",
        writer: "turjo",
        summary: "collection of fb status",
      })
      .set("x-auth-token", token);
    expect(response.body.post.type).toBe("sell");
    expect(response.statusCode).toBe(201);
  });

  // Update Post
  test("PUT/ it should update a post", async () => {
    // login to get token
    const res = await request(app).post("/api/users/login").send({
      email,
      password: "123456",
    });

    const { token } = res.body;

    const post = await Post.findOne({ price: "500" });

    const response = await request(app)
      .put(`/api/posts/${post._id}`)
      .send({
        title: "I wanna sell this book",
        description: "lorem ipsum dollar emmet",
        price: "900",
        type: "sell",
        name: "lilkhata by adarsha",
        writer: "turjo",
        summary: "collection of fb status",
      })
      .set("x-auth-token", token);
    expect(response.body.post.price).toBe(900);
    expect(response.statusCode).toBe(200);
  });

  // Delete Post
  test("POST/ it should delete a post", async () => {
    // login to get token
    const res = await request(app).post("/api/users/login").send({
      email,
      password: "123456",
    });

    const { token } = res.body;

    const post = await Post.findOne({ price: "900" });

    const response = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set("x-auth-token", token);
    expect(response.statusCode).toBe(200);
  });

  test("PUT/ it should update a user", async () => {
    const res = await request(app).post("/api/users/login").send({
      email,
      password: "123456",
    });

    const {
      token,
      user: { _id },
    } = res.body;

    const response = await request(app)
      .put(`/api/users/${_id}`)
      .send({
        gender: "male",
        address: "Rasulpur, Dania, Dhaka",
        phone: "01521206149",
      })
      .set("x-auth-token", token);

    expect(response.body.user.gender).toBe("male");
    expect(response.statusCode).toBe(200);
  });
});
