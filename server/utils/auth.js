import jwt from "jsonwebtoken";

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: authorizationRequired });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId; 
        next(); 
    } catch (err) {
        console.error("Token verification failed:", err.message); 
        res.status(403).json({ message: invalidCredentials });
    }
};

export { auth };