import express from "express";
import tokenVerification from "../middleware/tokenVerification.mjs";
import { createTask, getAllTasks, updateTask, deleteTask } from "../Controller/taskController.mjs";

const router = express.Router();

router.post("/createtask", tokenVerification, createTask);
router.get("/getalltasks", tokenVerification, getAllTasks);
router.put("/updatetask/:id", tokenVerification, updateTask);
router.delete("/deletetask/:id", tokenVerification, deleteTask);

export default router;