const jwt = require('jsonwebtoken');
const secret = 'secret';

const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Token not present"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Token expired, please login again"
                });
            }
            return res.status(401).json({
                message: "Invalid token"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            err: error.message
        });
    }
};

module.exports = validateToken;