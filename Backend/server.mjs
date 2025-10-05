import express from "express";
import userRoutes from "./routes/userRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";
import connectToDB from "./db/userData.mjs";
import cors from "cors";

connectToDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://final-hackaton-task-management.vercel.app'
  ]
}));

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error', status });
});

// ✅ Export for Vercel
export default app;

// ✅ Optional local run
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running locally on port ${port}`);
  });
}
