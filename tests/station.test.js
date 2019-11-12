const request = require("supertest");
const app = require("../src/app");
const { Station } = require("../src/models");
const {
  companyOneId,
  companyTwoId,
  configureDatabase,
  stationOne,
  stationOneId,
  stationTwoId,
  stationThreeId
} = require("./fixtures/db");

beforeEach(configureDatabase);

test("Should Create Station", async () => {
  const response = await request(app)
    .post(`/station?companyId=${companyOneId}`)
    .send({ name: "Station 1", latitude: 45.452155, longitude: 24.216466 })
    .expect(201);
  expect(response.body).toMatchObject({ name: "Station 1" });
});

test("Should Not Create Station, With Invalid Company", async () => {
  await request(app)
    .post(`/station?companyId=fakiId`)
    .send({ name: "Station 1", latitude: 45.452155, longitude: 24.216466 })
    .expect(404);
});

test("Should Not Create Station, With Invalid Coordinates", async () => {
  await request(app)
    .post(`/station?companyId=${companyOneId}`)
    .send({ name: "Station 1", latitude: "fake", longitude: "fake" })
    .expect(400);
});

test("Should Not Create Station, With Invalid Credentials", async () => {
  await request(app)
    .post(`/station?companyId=${companyOneId}`)
    .send({ name: "", latitude: "", longitude: "" })
    .expect(400);
});

test("Should Get Station", async () => {
  const response = await request(app)
    .get(`/station/${stationOneId}`)
    .expect(200);
  expect(response.body).toMatchObject({ name: "Station 1 Yerevan" });
});

test("Should Not Get Station, With Invalid Station Id", async () => {
  const response = await request(app)
    .get(`/station/fake`)
    .expect(404);
});

test("Should Not Get Stations Of Company Hierarchically, With Invalid Company Id", async () => {
  const response = await request(app)
    .get(`/stations?companyId=fake`)
    .expect(400);
});

test("Should Get Stations Of Company Hierarchically", async () => {
  const firstResponse = await request(app)
    .patch(`/company/own?companyId=${companyOneId}`)
    .send({ companyIdNeedOwn: companyTwoId })
    .expect(200);
  const secondResponse = await request(app)
    .get(`/stations?companyId=${companyOneId}`)
    .expect(200);
  expect(secondResponse.body.length).toBe(3);
});

test("Should Get All Stations", async () => {
  const response = await request(app)
    .get(`/stations`)
    .expect(200);
  expect(response.body.length).toBe(3);
});

test("Should Not Get All Stations", async () => {
  const response = await request(app)
    .get(`/stations`)
    .expect(200);
  expect(response.body.length).not.toBe(2);
});

test("Should Get Point In Radius ", async () => {
  const { latitude, longitude } = stationOne;
  const response = await request(app)
    .get(`/stationsInRadius?radius=1000&long=${longitude}&lat=${latitude}`)
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("Should Not Get Point In Radius, With Invalid Coordinates", async () => {
  await request(app)
    .get(`/stationsInRadius?radius=1000&long=fake&lat=fake`)
    .expect(400);
});

test("Should Update Station", async () => {
  await request(app)
    .patch(`/station/${stationTwoId}`)
    .send({ name: "Station Unknown", latitude: 54.155466, longitude: 54.84446 })
    .expect(200);
  const station = await Station.findById(stationTwoId);
  expect(station.name).toBe("Station Unknown");
});

test("Should Delete Station", async () => {
  const response = await request(app)
    .delete(`/station/${stationThreeId}`)
    .expect(200);
  const stations = await Station.find();
  expect(stations.length).toBe(2);
});

test("Should Not Delete Station, With Invalid Station Id", async () => {
  await request(app)
    .delete(`/station/fake`)
    .expect(500);
  const stations = await Station.find();
  expect(stations.length).toBe(3);
});
