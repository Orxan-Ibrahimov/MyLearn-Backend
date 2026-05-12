const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    // Format: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET);

        // attach user info to request
        req.user = decoded;
        next(); // continue to route

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;