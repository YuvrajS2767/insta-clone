import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

// Load environment variables
dotenv.config();

// Set the PORT from environment variables or use 3000 as a default
const PORT = process.env.PORT || 3000;

// Ensure __dirname is correctly resolved
const __dirname = path.resolve();

// Connect to the database before starting the server
connectDB();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Set up CORS options to allow requests from your local frontend
const corsOptions = {
    origin: ['http://localhost:5173', process.env.URL], // Allow both local and deployed frontend
    credentials: true, // Allow credentials (cookies, HTTP authentication)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));

// Define API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
