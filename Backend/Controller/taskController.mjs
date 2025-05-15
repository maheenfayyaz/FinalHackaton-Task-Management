import chalk from "chalk";
import Task from "../models/users/task.mjs";
import createTaskSchema from "../schema/taskSchema.mjs";
import User from "../models/users/index.mjs";

const createTask = async (req, res) => {
    console.log(chalk.grey("Calling to creating task API"), req.body);

    try {
        // Only admin can create tasks
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admin can create tasks", status: 403 });
        }

        await createTaskSchema.validateAsync(req.body);
        const { title, description, assignedTo, status } = req.body;
        const task = new Task({ title, description, assignedTo, status });
        await task.save();
        res.status(201).json({ message: "Task created successfully", task, status: 201 });
    } catch (error) {
        console.error(chalk.red("Create Task Error:"), error);
        res.status(400).json({ error: error.message || "Validation Failed", status: 400 });
    }
}

const getAllTasks = async (req, res) => {
    try {
        console.log(chalk.grey("Calling to get all tasks API"));

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized", status: 401 });
        }

        const tasks = await Task.find({});

        res.status(200).json({ tasks, status: 200 });
    } catch (error) {
        console.error(chalk.red("Get All Tasks Error:"), error);
        res.status(500).send({ error: error.message || "Something went wrong", status: 500 });
    }
}

const updateTask = async (req, res) => {
    try {
        console.log(chalk.grey("Calling to update task API"));
        const { id } = req.params;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized", status: 401 });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found", status: 404 });
        }

        if (user.role === "admin") {
            await createTaskSchema.validateAsync(req.body);
            const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ message: "Task updated successfully", task: updatedTask, status: 200 });
        } else {
            if (task.assignedTo !== user.name) {
                return res.status(403).json({ message: "Forbidden: You can only update your own tasks", status: 403 });
            }

            if (!req.body.status || Object.keys(req.body).length !== 1) {
                return res.status(400).json({ message: "Bad Request: Only status field can be updated", status: 400 });
            }

            task.status = req.body.status;
            await task.save();
            return res.status(200).json({ message: "Task status updated successfully", task, status: 200 });
        }
    } catch (error) {
        console.error(chalk.red("Update Task Error:"), error);
        res.status(400).json({ error: error.message || "Validation failed", status: 400 });
    }
};

const deleteTask = async (req, res) => {
    console.log("Calling to delete task API");
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admin can delete tasks", status: 403 });
        }

        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            console.log("Task not found for id:", id);
            return res.status(404).json({ message: "Task not found", status: 404 });
        }
        console.log("Task deleted successfully for id:", id);
        res.status(200).json({ message: "Task deleted successfully", status: 200 });
    } catch (error) {
        console.error(chalk.red("Delete Task Error:"), error);
        res.status(500).json({ error: error.message || "Something went wrong", status: 500 });
    }

}

export { createTask, getAllTasks, updateTask, deleteTask };
