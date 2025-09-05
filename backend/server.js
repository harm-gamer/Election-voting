import express from "express";
import dotenv from "dotenv";
import connect from "./db/db.js";

const app = express();

dotenv.config();
connect();
app.listen(3000,() =>{
    console.log("Server is running on port 3000");
})

