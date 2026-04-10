import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({
    path: "./.env"
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});
    


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`❌ Error in connecting to database: ${error}`);
        process.exit(1);
    });