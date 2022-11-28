const jwt = require("jsonwebtoken");

const isLoggedIn = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                res.status(403).json(err);
                return;
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated!");
    }
}

const isAdmin = async(req, res, next) => {
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not an admin!");
            return;
        }
    };

module.exports = {isLoggedIn, isAdmin}