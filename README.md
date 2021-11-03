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

Make GET request, you should get big JSON back:

```
curl http://localhost:3000 -X GET
```

Make POST request, you should see the JSON data inside server tab, and you should get big JSON back:

```
curl http://localhost:3000 -X POST --data '@data.json'
```
