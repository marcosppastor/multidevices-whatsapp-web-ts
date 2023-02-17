// const { data } = require("../config/clients.json");

module.exports = (req, res, next) => {
    next();
    // let auth = req.header('CL-token');
    // if (!auth) {
    //     res.status(401).json({
    //         message: 'Unauthorized'
    //     });
    // } else {
    //     const { name } = req.params;

    //     const search = data.find(u => u.token == auth);

    //     if (search?.name !== name) {
    //         return res.status(401).json({
    //             message: 'Unauthorized'
    //         });
    //     }

    //     next();
    // }
}