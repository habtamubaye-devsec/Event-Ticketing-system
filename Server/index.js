const express = require("express");
const usersRoutes = require("./src/routes/usersRoutes");
const eventsRoute = require("./src/routes/eventsRoute");
const bookingsRoute = require('./src/routes/bookingsRoute')
const reportRoute = require('./src/routes/reportRoutes')
const connectDB = require("./src/config/connectDB");
const cookieParser = require("cookie-parser");
const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '.env') });

if (dotenvResult.error) {
  console.error('Failed to load .env file:', dotenvResult.error);
} else {
  console.log('Loaded env vars:', dotenvResult.parsed);
}

console.log('CONNECTION_STRING:', process.env.CONNECTION_STRING);


connectDB()

const app = express()

const port = process.env.PORT || 5000;

//Routes
app.use(express.json());
app.use(cookieParser())
app.use("/api/users", usersRoutes);
app.use("/api/events", eventsRoute);
app.use("/api/booking", bookingsRoute);
app.use("/api/reports", reportRoute);

app.listen(port, () => {
    console.log(`Node + Express server is running on port ${port}`)
})