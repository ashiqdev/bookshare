import request from "supertest";
import app from "../../src/app";

jest.mock("../../src/services/user-service");

describe("UserController Test suite", () => {
  // test("GET/ should return an array of users", async () => {
  //   const res = await request(app).get("/api/users");
  //   const users = res.body;
  //   expect(res.statusCode).toBe(200);
  //   expect(users.length).toBeGreaterThan(0);
  //   expect(users[0].id).toBe("1");
  // });

  test("POST/ should register user and return a success message", async () => {
    const user = {
      name: "test001",
      email: "test001@gmail.com",
      password: "123456",
    };
    const res = await request(app).post("/api/users/register").send(user);

    expect(res.body.message).toBe("verification url sent to your mail");
  });

  test("POST/ should verify the user", async () => {
    //  I am giving here dummy token
    const res = await request(app)
      .post("/api/users/verify")
      .send({ email: "test001@gmail.com", emailToken: "abc123" });

    const { token } = res.body;

    expect(res.statusCode).toBe(200);
    expect(token).not.toBe(null);
  });

  test("POST/ should login the user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "test001@gmail.com", password: "123456" });

    const { token } = res.body;
    expect(token).not.toBe(null);
  });

  test("POST/ should return a success message if reset token is sent", async () => {
    const res = await request(app)
      .post("/api/users/forget")
      .send({ email: "test001@gmail.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("reset url sent to your mail");
  });

  test("Post/ should return a success message if password reset successfully", async () => {
    const res = await request(app)
      .post("/api/users/reset")
      .send({ password: "12345678" });

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe("Password has been changed");
  });

  test("POST/ should send a verification email", async () => {
    const res = await request(app).post("/api/users/sendVerification").send({
      email: "test001@gmail.com",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("verification url sent to your mail");
  });

  // test("POST/ should return saved id", async () => {
  //   const user = { name: "test430", email: "test430@gmail.com" };
  //   const res = await request(app).post("/api/users").send(user);
  //   const id = res.body;
  //   expect(res.statusCode).toBe(201);
  //   expect(id.length).toBe(24);

  //   const fetchedUser = await request(app).get(`/api/users/${id}`);
  //   expect(fetchedUser.body.name).not.toBe(null);
  //   expect(fetchedUser.body.name).toBe(user.name);
  // });

  // test("GET/ get by id should return an user", async () => {
  //   const res = await request(app).get("/api/users/1");
  //   const user = res.body;
  //   expect(user.id).toBe("1");
  // });

  // test("PUT/ should update an existing user", async () => {
  //   const user = { id: "1", name: "004", email: "test004@gmail.com" };
  //   const body = { name: user.name, email: user.email };
  //   const res = await request(app)
  //     .put(`/api/users/${user.id}`)
  //     .send(body, user.id);

  //   expect(res.statusCode).toBe(200);

  //   const updatedUserResponse = await request(app).get("/api/users/1");
  //   const updatedUser = updatedUserResponse.body;
  //   expect(updatedUser.name).toBe(user.name);
  // });

  //   test("DELETE/ should return an success message", async () => {
  //     const res = await request(app).delete("/api/users/1");
  //     expect(res.statusCode).toBe(200);
  //     const deletedUserResponse = await request(app).get("/api/users/1");
  //     expect(deletedUserResponse.statusCode).toBe(404);
  //   });
});
