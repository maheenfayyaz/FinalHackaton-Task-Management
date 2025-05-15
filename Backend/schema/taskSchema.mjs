import joi from 'joi';

const createTaskSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    assignedTo: joi.string().required(),
    status: joi.string().valid('To Do', 'In Progress', 'Completed').default('To Do'),
});

export default createTaskSchema