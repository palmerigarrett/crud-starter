# Simple CRUD App
This is meant to be an easy way to spin up a backend to support a CRUD application. 

It contains:
- 4 routes that can be used or modified for specific needs.
- 1 blogpost table
- a docker command to spin up a postgres instance

## Steps to start
The following assumes PostgresQL and Docker Desktop are both installed locally

1. run the following command to spin up a postgresql instance `docker run -d --name crud -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=abcde12345 -e POSTGRES_DB=crud -e POSTGRES_HOST=localhost -e POSTGRES_PORT=5432 -v db_volume:/var/lib/postgresql postgres:latest`
2. In the `/server` directory, run `npm install`
3. run `npm start`

Your node server will now be running on port 8001 with hot reload enabled.

