import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
async function connect(params) {
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongodb connected");
}

export default connect;

