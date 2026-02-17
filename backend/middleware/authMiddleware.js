const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Accept token from Authorization: Bearer OR x-auth-token
        let token = req.headers['x-auth-token'] || 
            (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 
                ? req.headers.authorization.split(" ")[1] 
                : null);

        if (!token || typeof token !== 'string') {
            return res.status(401).json({ message: "No token provided" });
        }
        token = token.trim();

        const decoded = jwt.verify(token, "your-secret-key-12345");

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
