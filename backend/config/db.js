import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database is connected...");
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);    //if error, i wanna kill my app and does not want it to keep processing
    }
};

export default connectDB;