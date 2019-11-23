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

### Run On Local Environment

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

### Run with docker compose

Clone repository.

```sh
$ git clone
$ cd chargeStation
```

Setup dev.nev and test.env in config folder like in example below.

```sh
PORT=[PORT NUMBER]
MONGODB_URL=[mongodb://HOST:DB_PORT/DB]
```

```sh
$ docker-compose up
```

And ready to go!!!

![Mask](https://media.giphy.com/media/12RAJd5PPboWpW/giphy.gif)

### Default data

By default companies.json and stations.json have data structured like in image below.

![Diagram](https://bitbucket.org/z-khachatryan/chargestations/raw/cfc509897cf14898c77f89e6dc10e081ef60fe20/Diagram.jpg)

Companies with even numbers have 3 stations and with odd numbers 4 stations for each one.
In the place of station coordinates, I used the coordinates of the capital cities to make easy to test coordination endpoints.
Of course it is possible to edit/modify this data as needed, using CRUD functionality.

### Usage

Here is endpoints to use`

#### Get Companies [GET]

Get specific company.

```sh
/company/[companyId]
```

Get all companies.

```sh
/company
```

Get child companies.

```sh
/company/[companyId]/childCompanies
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
/company/[companyId]/own
```

Request body.

```sh
{
	"companyIdNeedOwn":[company_id_need_to_own]
}
```

#### Delete Company [DELETE]

```sh
/company/[companyId]
```

#### Get Stations [GET]

```sh
/station
```

Set companyId query string with specific company ObjectId to get stations hierarchically.

```sh
/station?companyId=[owner_company_id]
```

Set station ObjectId to get specific station.

```sh
/station/[station_id]
```

#### Create Station [POST]

```sh
/station/[companyId]
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
/station/stationsInRadius?radius=[radius_in_kilometers]&lat=[latitude]&long=[longitude]
```
