const jwt = require("jsonwebtoken");


const validateToken = (req,  res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const headerToken =
          typeof authHeader === "string" && authHeader.startsWith("Bearer ")
            ? authHeader.slice("Bearer ".length).trim()
            : null;

        const token = headerToken || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized"})
        }
        const decryptObj = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decryptObj;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });        
    }
};


module.exports = validateToken;