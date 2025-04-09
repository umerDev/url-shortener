# URL Shortener

Enter a url and get a short url back using a random hash.

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

This application is using NextJS, tRPC, Postgresql, Prisma

## Database schema
The database has one table `URL` with the following columns:
- `id` - Integer, primary key, auto increment
- `url` - String, the original URL
- `url_hash` - String, the hash of the URL
- `createdAt` - Timestamp, when the URL was created
- `updatedAt` - Timestamp, when the URL was last updated

## To start
1. `docker compose up`
2. navigate to `http://localhost:3000`


