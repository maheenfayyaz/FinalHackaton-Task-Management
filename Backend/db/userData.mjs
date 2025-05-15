import mongoose from "mongoose";
import "dotenv/config";
import chalk from "chalk";

const dbName = process.env.DB_USER_NAME;
const url = process.env.URL;

const connectToDB = () => {
    mongoose.connection.on("connected", () => {
        console.log(chalk.bold.blue("Connected to Mongo DB"));
    });

    mongoose.connection.on("disconnected/error", () => {
        console.log(chalk.bold.red("Disconnected/Error with connection from Mongo DB"));
    });
}

mongoose.connect(url)
export default connectToDB