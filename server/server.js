const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();

connectDB();

const app = express();

// CORS — allow frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

// Add Render frontend URL if set
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In production allow any render.com subdomain
    if (process.env.NODE_ENV === "production" && origin.endsWith(".onrender.com")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API Running" });
});

// API health check
app.get("/api", (req, res) => {
  res.json({ 
    message: "API is running",
    endpoints: {
      auth: "/api/auth (POST /register, POST /login, GET /profile, PUT /profile)",
      transactions: "/api/transactions",
      budgets: "/api/budgets"
    }
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
