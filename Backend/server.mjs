import express from "express";
import userRoutes from "./routes/userRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";
import mongoose from "./db/userData.mjs";
import chalk from "chalk";
import connectToDB from "./db/userData.mjs";
import cors from "cors";

connectToDB();

const app = express();
const port = 5000

app.use(cors({
  origin:[
    'http://localhost:5173',
    'http://localhost:5174',
    'https://final-hackaton-task-management.vercel.app'
  ]
}));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

// 192.168.0.168

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error', status });
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })