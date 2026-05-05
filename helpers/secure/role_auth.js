const { Roles } = require('../enums/role');

function authorize(allowedRoles = []) {
    return (req, res, next) => {
        const userRole = req.auth?.role;

        if (!userRole) {
            return res.status(401).json({ message: "No role found" });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }

        next();
    };
}

module.exports = authorize;