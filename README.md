The following npm install should occur before attempting to run this application:

[npm install -D babel-register babel-preset-env babel-eslint eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest jest]

Also, install these packages before running the application:

[npm i winston@next dotenv faker]

Install Mongodb and start your mongodb server before running the application.

How to start server: start the server via the startServer() function from the server.js file. This will allow us to connect to our mongodb (process.env.MONGODB_URI). Mongoose acts as the middleware that connects us from our computer to the mongodb.

how to make requests to each endpoint:

authRouter.post() is how a user submits a post request.  Upon a successful post request, a new Account for the user will be created.  The new Account consists of the username, email and password, also a unique token will be generated.  That token is essentially the id for the user's account.  If there is no database available to receive the new data we've attempted to send or a bad json request occurred, the server will display a 400 error and error message will read 'Responding with a 400 error code.' If a post request occurs and an instance of that post already exists, a 409 duplicate key error message will display. If the new data is posted successfully to mongodb the server will display a 200 message and the message will read 'POST - responding with a 200 status code'.
