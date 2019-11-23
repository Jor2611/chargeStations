const request = require("supertest");
const app = require("../src/app");
const { Company, Station } = require("../src/models");
const {
  companyOne,
  companyOneId,
  companyTwoId,
  configureDatabase
} = require("./fixtures/db");

beforeEach(configureDatabase);

test("Should Create Company", async () => {
  const response = await request(app)
    .post("/company")
    .send({
      name: "Test Company"
    })
    .expect(201);
  const company = await Company.findById(response.body.data._id);
  expect(company).not.toBeNull();
  expect(response.body.data).toMatchObject({
    name: "Test Company",
    children: []
  });
});

test("Should Not Create Duplicate Company", async () => {
  await request(app)
    .post("/company")
    .send({
      name: companyOne.name
    })
    .expect(422);
});

test("Should Not Create Company With Invalid Name", async () => {
  await request(app)
    .post("/company")
    .send({
      name: ""
    })
    .expect(400);
});

test("Should Get All Companies", async () => {
  const response = await request(app)
    .get(`/company`)
    .expect(200);
  const companies = await Company.find();
  expect(response.body.data.length).toBe(companies.length);
});

test("Should Get Company", async () => {
  const response = await request(app)
    .get(`/company/${companyOneId}`)
    .expect(200);
  expect(response.body.data).toMatchObject({ name: companyOne.name });
});

test("Should Not Get Company, Which Doesn't Exist", async () => {
  await request(app)
    .get(`/company/fakeId`)
    .expect(404);
});

test("Should Delete A Company With Owned Stations", async () => {
  await request(app)
    .delete(`/company/${companyOneId}`)
    .expect(200);
  const deletedCompany = await Company.findById(companyOneId);
  const childStations = await Station.findOne({ _id: companyOneId });
  expect(deletedCompany).toBeNull();
  expect(childStations).toBeNull();
});

test("Should Not Delete A Company, Which Doesn't Exist", async () => {
  await request(app)
    .delete(`/company/fakeId`)
    .expect(404);
});

test("Should Own Company, But Only Once", async () => {
  const firstResponse = await request(app)
    .patch(`/company/${companyOneId}/own`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(200);

  const secondResponse = await request(app)
    .patch(`/company/${companyOneId}/own`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(422);
  const checkUser = await Company.findById(companyOneId);
  expect(checkUser.children[0]).toEqual(companyTwoId);
  expect(checkUser.children.length).toBe(1);
});

test("Should Not Own Company With Invalid Owner Id", async () => {
  await request(app)
    .patch(`/company/fakeId/own`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(404);
});

test("Should Not Own Company Which not exist", async () => {
  await request(app)
    .patch(`/company/${companyOneId}/own`)
    .send({ companyIdNeedOwn: "5dbe2e96470b4a78d4d132d5" })
    .expect(404);
});

test("Should Not Own Company With Invalid Company Id", async () => {
  await request(app)
    .patch(`/company/${companyOneId}/own`)
    .send({ companyIdNeedOwn: "5dbe2e96470b4a78d4d132d44" })
    .expect(400);
});

test("Should Not Own Company With Invalid Credentials", async () => {
  await request(app)
    .patch(`/company/${companyOneId}/own`)
    .send({ companyIdNeedOwnn: companyTwoId })
    .expect(400);
});
