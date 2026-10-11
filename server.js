require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const appliactionrouter=require("./routes/application")
const jobrouter=require("./routes/job")
const authrouter=require("./routes/auth")
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth",authrouter)
app.use("/job",jobrouter)
app.use("/appiaction",appliactionrouter)


const startServer = async () => {
    try {
        await connectDB();
       
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running");
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
};

startServer();