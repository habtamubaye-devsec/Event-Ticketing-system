const express = require("express");
const usersRoutes = require("./src/routes/usersRoutes");
const eventsRoute = require("./src/routes/eventsRoute");
const bookingsRoute = require('./src/routes/bookingsRoute')
const reportRoute = require('./src/routes/reportRoutes')
const connectDB = require("./src/config/connectDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '.env') });

if (dotenvResult.error) {
  console.error('Failed to load .env file:', dotenvResult.error);
}


connectDB()

const app = express()

const port = process.env.PORT || 5000;

//Routes
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Optional convenience for Vercel previews: allow *.vercel.app
    try {
      const { hostname } = new URL(origin);
      if (hostname.endsWith(".vercel.app")) return callback(null, true);
    } catch {
      // ignore
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use("/api/users", usersRoutes);
app.use("/api/events", eventsRoute);
app.use("/api/booking", bookingsRoute);
app.use("/api/reports", reportRoute);

app.listen(port, () => {
    console.log(`Node + Express server is running on port ${port}`)
})