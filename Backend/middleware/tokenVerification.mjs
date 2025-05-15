import jwt from "jsonwebtoken";
import 'dotenv/config';

const tokenVerification = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if(decoded) {
                req.user = decoded;
                next();
            }
            else {
                res.status(401).json({ message: "Unauthorized Token", status: 401 });
            }
        }
        else {
         res.status(401).send({ message: "Unauthorized Access", status: 401 });   
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: error.message, status: 401, message: "Unauthorized Token" });
    }
}

export default tokenVerification

