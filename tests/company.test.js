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
  const company = await Company.findById(response.body._id);
  expect(company).not.toBeNull();
  expect(response.body).toMatchObject({ name: "Test Company", children: [] });
});

test("Should Not Create Duplicate Company", async () => {
  await request(app)
    .post("/company")
    .send({
      name: companyOne.name
    })
    .expect(400);
});

test("Should Not Create Company With Invalid Name", async () => {
  await request(app)
    .post("/company")
    .send({
      name: ""
    })
    .expect(500);
});

test("Should Get All Companies", async () => {
  const response = await request(app)
    .get(`/companies`)
    .expect(200);
  const companies = await Company.find();
  expect(response.body.length).toBe(companies.length);
});

test("Should Get Company", async () => {
  const response = await request(app)
    .get(`/company?companyId=${companyOneId}`)
    .expect(200);
  expect(response.body).toMatchObject({ name: companyOne.name });
});

test("Should Not Get Company, Which Doesn't Exist", async () => {
  await request(app)
    .get(`/company?companyId=fakeId`)
    .expect(404);
});

test("Should Delete A Company With Owned Stations", async () => {
  await request(app)
    .delete(`/company?companyId=${companyOneId}`)
    .expect(200);
  const deletedCompany = await Company.findById(companyOneId);
  const childStations = await Station.findOne({ _id: companyOneId });
  expect(deletedCompany).toBeNull();
  expect(childStations).toBeNull();
});

test("Should Not Delete A Company, Which Doesn't Exist", async () => {
  await request(app)
    .delete(`/company?companyId=fakeId`)
    .expect(404);
});

test("Should Own Company, But Only Once", async () => {
  const firstResponse = await request(app)
    .patch(`/company/own?companyId=${companyOneId}`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(200);

  const secondResponse = await request(app)
    .patch(`/company/own?companyId=${companyOneId}`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(500);
  const checkUser = await Company.findById(companyOneId);
  expect(checkUser.children[0]).toEqual(companyTwoId);
  expect(checkUser.children.length).toBe(1);
});

test("Should Not Own Company With Invalid Owner Id", async () => {
  await request(app)
    .patch(`/company/own?companyId=fakeId`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(404);
});

test("Should Not Own Company With Invalid Company Id", async () => {
  await request(app)
    .patch(`/company/own?companyId=${companyOneId}`)
    .send({ companyIdNeedOwn: "fakeId" })
    .expect(500);
});
