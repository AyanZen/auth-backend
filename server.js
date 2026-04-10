import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config({
    path: "./.env"
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`❌ Error in connecting to database: ${error}`);
        process.exit(1);
    });