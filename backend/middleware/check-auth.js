const jwt = require('jsonwebtoken');

module.exports = (req,res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer afllfdfkjfdfcvsdljflm5
        jwt.verify(token,APP_KEY);
        next();
    }
    catch(error) {
        res.status(401).json({message:"Auth failed again!"});
    }

};