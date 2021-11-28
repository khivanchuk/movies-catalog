# movies-catalog

Application for creating lists of movies and series (with ratings, favorite lists etc.), based on using a third party service http://www.omdbapi.com.

## Run project

### To run native server implementation

Start server:

```
APP_PORT=3000 npx ts-node ./src/server-native.ts -env=dev
```

The expected result should be:

```
Server is listening on port 3000. Env is dev.
```

Make GET request, you should get big JSON back:

```
curl http://localhost:3000 -X GET
```

Make POST request, you should see the JSON data inside server tab, and you should get big JSON back:

```
curl http://localhost:3000 -X POST --data '@data.json'
```

### To run express server implementation

Start server:

```
npm start
```

The expected result should be:

```
Server is listening on port 3000.
```

## API Example

Registration:

```
POST 127.0.0.1:3000/auth/registration

```

Login:

```
POST 127.0.0.1:3000/auth/login

```

### User needs to be authorized to be able to create, update, delete movie, add movie to favourites

Create movie:

```
POST 127.0.0.1:3000/movies

body: {
   "title": "title",
   "comment": "comment",
   "personalScore": 10
}
```

Update movie:

```
PATCH 127.0.0.1:3000/movies/:id

body: {
   "comment": "comment updated",
   "personalScore": 20
}
```

Delete movie:

```
DELETE 127.0.0.1:3000/movies/:id
```

Get movie:

```
GET 127.0.0.1:3000/movies/:id
```

Add movie to favourites:

```
127.0.0.1:3000/markFavourite/:id
```

Get all movies:

```
GET 127.0.0.1:3000/movies?sortBy=personalScore&pageSize=2&pageNumber=1
```

## Logger

To test the logger, run some requests and check `logger.log` file:
