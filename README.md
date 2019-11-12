# Charging Stations

### Installation

##### 1)

Clone repository, install dependencies.

```sh
$ git clone
$ cd chargeStation
$ npm install
```

Setup dev.nev and test.env in config folder like in example below.

```sh
PORT=[PORT NUMBER]
MONGODB_URL=[mongodb://HOST:DB_PORT/DB]
```

### (Optional)

Add Companies and Stations collections to db
to make testing easy.

```sh
$ npm run db
```

And then run development server!!

```sh
$ npm run dev
```

For testing.

```sh
npm run test
```

### OR

##### 2)

If you have docker and docker compose, just copy docker-compose.yml file and run docker compose.

```sh
$ docker-compose up
```

And ready to go!!!

![Mask](https://media.giphy.com/media/12RAJd5PPboWpW/giphy.gif)

### Default data

By default companies.json and stations.json have data structured like in image below.

![Diagram](https://github.com/Jor2611/chargeStations/Diagram.jpg)

Companies with even numbers have 3 stations and with odd numbers 4 stations for each one.
In the place of station coordinates, I used the coordinates of the capital cities to make easy to test coordination endpoints.
Of course it is possible to edit/modify this data as needed, using CRUD functionality.

### Usage

Here is endpoints to use`

#### Get Companies [GET]

Get specific company.

```sh
/company?companyId=[company_id]
```

Get all companies.

```sh
/companies
```

#### Create Company [POST]

```sh
/company
```

Request body.

```sh
{
	"name":"Mercedes-Benz"
}
```

#### Own Company [PATCH]

```sh
/company/own?companyId=[Owner_company_id]
```

Request body.

```sh
{
	"companyIdNeedOwn":[company_id_need_to_own]
}
```

#### Delete Company [DELETE]

```sh
/company/companyId=[company_id]
```

#### Get Stations [GET]

```sh
/stations
```

Set companyId query string with specific company ObjectId to get stations hierarchically.

```sh
/stations?companyId=[owner_company_id]
```

Set station ObjectId to get specific station.

```sh
/station/[station_id]
```

#### Create Station [POST]

```sh
/station?companyId=[owner_company_id]
```

Request body.

```sh
{
	"name":"Station 1",
	"latitude":[lat],
	"longitude":[long]
}
```

#### Update Station [PATCH]

```sh
/station/[station_id]
```

Request body.

```sh
{
	"name":"Station 2",
	"latitude":[lat],
	"longitude":[long]
}
```

#### Delete Station [DELETE]

```sh
/station/[station_id]
```

#### Find Stations in Radius [GET]

```sh
/stationsInRadius?radius=[radius_in_kilometers]&lat=[latitude]&long=[longitude]
```
