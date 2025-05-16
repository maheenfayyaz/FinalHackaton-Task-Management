import bcrypt from "bcrypt";
import UserData from "../models/users/index.mjs";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import schema from "../schema/userSchema.mjs";
import chalk from "chalk";
import nodemailer from "nodemailer";

const signUp = async (req, res) => {
    console.log(chalk.cyan("Incoming call to signup API"), req.body);

    if (!req.body) {
        return res.status(400).json({ message: "Bad request" });
    }

    try {
        await schema.validateAsync(req.body);
        const password = bcrypt.hashSync(req.body.password, 10);
        const user = await UserData.create({ ...req.body, password });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        await user.save();
       
        res.status(201).json({
            message: "User created successfully",
            user: { id: user.id, email: user.email, name: user.name },
            token: token,
            userID: user._id
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                message: "Duplicate email - Email already exists",
                error: error.message,
            });
        }
        console.error(chalk.red("Signup Error:"), error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
};
const logIn = async (req, res) => {
    try {
        console.log(chalk.yellow("Incoming login request:"), req.body);
        const { email, password } = req.body
        console.log("Login attempt with email:", email);
        const user = await UserData.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ success: true, status: 200, message: "Login Successful", user, token });
        } else {
            res.status(401).json({ success: false, status: 401, message: "Incorrect Password" });
        }

    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, status: 500 });
    }
};

const forget = async (req, res) => {
    const { email } = req.body;
    try {
        const seasonedUser = await UserData.findOne({ email });
        if (!seasonedUser) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }
        const secret = process.env.JWT_SECRET_KEY + seasonedUser.password;
        const token = jwt.sign({ email: seasonedUser.email, id: seasonedUser._id }, secret, { expiresIn: '30m' });
        const link = `${process.env.FRONTEND_URL}/resetpassword/${seasonedUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL_USER,
            to: seasonedUser.email,
            subject: 'Password Reset',
            text: link
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        console.log(link);
        res.status(200).json({ message: "Password reset link generated", link });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const user = await UserData.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        const secret = process.env.JWT_SECRET_KEY + user.password;
        try {
            jwt.verify(token, secret);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token", status: 401 });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

import uploadCloudinary from '../config/Cloudinary.mjs';

const updateProfile = async (req, res) => {
    const userId = req.user.userId; 
    const { userName, currentPassword, newPassword } = req.body;
    let profileImage;

    try {
        const user = await UserData.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        if (req.file) {
            try {
                const result = await uploadCloudinary(req.file.buffer);
                profileImage = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
            }
        }
        if (userName) {
            user.name = userName;
        }

        if (profileImage) {
            user.profileImage = profileImage;
        }

        if (currentPassword && newPassword) {
            const isMatch = bcrypt.compareSync(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Current password is incorrect", status: 401 });
            }
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
            user.password = hashedNewPassword;
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { signUp, logIn, forget, resetPassword, updateProfile };
