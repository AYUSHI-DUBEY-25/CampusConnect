import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import authRoutes from "./router/authRouter.js";
import morgan from "morgan";
import cors from "cors";
import categoryRoutes from "./router/categoryRouter.js";
import eventRoutes from "./router/eventRouter.js";
import subscribeRouter from "./router/subscribeRouter.js";


dotenv.config({ path: "./.env" });
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-connect-brown-phi.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("hiii");
});

app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/event', eventRoutes);
app.use("/api/subscribe", subscribeRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
