import mongoose, { Mongoose } from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log("✅ Database connected successfully");
        })
    } catch (error) {
        console.log(`❌ Error in connecting to database: ${error}`);
        process.exit(1);
    }
}

export default connectDB;