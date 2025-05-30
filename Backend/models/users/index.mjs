import joi from "joi"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name:{
            type: mongoose.Schema.Types.String,
            required: true,
        },
        email:{
            type: mongoose.Schema.Types.String,
            required: true,
            unique: true,
        },
        password:{
            type: mongoose.Schema.Types.String,
            required: true,
        },
        profileImage: {
            type: mongoose.Schema.Types.String,
            default: '',
        },
        role:{
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        isCustomer:{
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps:{
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

const User = mongoose.model('user', userSchema)
export default User;