# YAB

###### (Yet Another Boilerplate)

React-Static, Express, Auth (JWT), Mock API, Jest, Redux

Why use it? You want to use react-static, but need it connected to an Express server that handles JWT authentication during development and in production. It's also preconfigured with Jest for testing, Redux for state management (including auth state), and a Mock API for development. The Express server is intended to be proxied in development for authentication, but used to distribute the react-static build in production. Testing for authentication components and routes have already been implemented.

## Workflow & Package.json Scripts

For development you'll need to run the `start` and `test` scripts side by side. Run `start` first, as the servers it starts are needed for your tests.

For production you'll just need to run the `serve` script.

To test production code (except for API, uses MOCK API) on your local machine, use the `serve-local` script

* `rs-start`: Starts the react-static development server
* `build`: Creates a static build of the react-static application
* `rs-serve`: Runs a single-purpose server to render the build output. This is not connected to authentication or bidchuck apis.
* `server`: Runs the server that handles Auth for both development and production, as well as distributes the build of the react-static application in production.
* `api-mock-server`: Runs the json-server that mocks our data/api. Used only in development and production-local enviornments
* **`start`**: Runs all servers and services needed for development (react static, express server that handles auth, json mock api) EXCEPT for testing. You'll want to run `start` and `test` side by side. You'll need the servers that are started with `start` in order for your tests to run.
* **`serve`**: Runs all servers and service needed for production
* `serve-local`: Simulates running the build output in production mode, **w/out SSL** and **with the JSON mock API**
* `test`: Run testing server in watch mode
* `test:update`: Update snapshots (only use this if you're 100% confident that changes didnt actually break the component)
* `test:coverage`: Checks current test coverage

## Environments Used

* development: Development code, on local development server
* production: Production code, on production server
* production-local: Production code, on local pseudo production server (no SSL used, Mock API is used)

## Environment Variables

All of these (except for NODE_ENV) need to be stored in a **.env** file at the root of the project directory.

* NODE_ENV: This should not be stored in the **.env** file at the root directory like all other variables. It needs to be used within the **package.json** scripts. This makes it possible for use the **production-local** env, which is to test production code on a local pseudo production server
* PORT: Any port allowed by the hosted OS can be used, although **5000** is the default port used by the application.
* API_URL: URL where the api is hosted. The production express server will proxy this URL and make it available at URI of `/api` for the application.
* CLIENT_SECRET: {base64 encoded string}
* HOME: Use only on production server. The location of the SSL/TLS certificates

## Proxy Servers

### API

* You can access all the api data from json-server by going to the `/api/db` route.
* You can access data inside each of the .json files by going to `/api/<FILENAME>`. Example: to access the data inside of `users.json`, you'd go to `/api/users`
* If you want to create routes with fake data, checkout the `api-mocks/dbFakers.js` file to add aditional fake data.

### Authentication

* Base route is at `/auth/`, not `/api/auth/`. This is due to conflicts with json-server when attempting to nest `auth` inside of `api`
* For sub auth routes, refer to the `server/auth/authRouter.js` file.
* A test user has been added to the users json mock with JWT authentication. You can add additional ones by using a tool like postman, or you can just use the one that's there.
  * Test Username: logan@seamonsterstudios.com
  * Test Password: password

## Component/file Architecture for front-end (`./src`)

* **/store**
  * **/actions**
  * **/reducers**
  * index.js
* **/styles**
  * fonts.css (font imports)
  * theme.js
  * global.js (global styles)
  * add other styles here as well
* **/utility**
  * utility/misc functions used throughout the app to keep the code DRY
* **/layouts**
  * wrapper/layout files, such as Main & Dashboard that. This is where we will connect to react-static's HOC/Render prop methods to get route data, and then pass that data down.
* **/views**
  * This is where we will store the route endpoints defined in the react-static config.
* **/components**
  * This is where all remaining components go. These components are typically reusable and don't depend on the view per se.

## Tools Used and References

* React Static: https://react-static.js.org/
* Redux: https://redux.js.org/
* Prop Types: https://reactjs.org/docs/typechecking-with-proptypes.html
* Jest: https://facebook.github.io/jest/docs/en/getting-started.html
* React Testing Library: https://github.com/kentcdodds/react-testing-library#custom-jest-matchers
* Styled Components: https://www.styled-components.com/docs
* JSON server for Mock API:
  * https://github.com/typicode/json-server
  * https://github.com/typicode/json-server
* Express:
  * https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
  * https://github.com/esausilva/quick-node-server/blob/master/server.js
* JWT Authentication w/Express: https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
* Redux Auth Wrapper: https://mjrussell.github.io/redux-auth-wrapper/
