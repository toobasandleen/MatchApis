
const authorizaionCheck = (req, res, next) => {
    const requiredRole = "admin"
    if (!req.adminn) {
        return res.status(401).json("Error: Authenticaton failed!")
    }
    if (req.adminn.role !== requiredRole) {
        return res.status(401).json("No Enough permission")
    }



    return next();
};

module.exports = authorizaionCheck;