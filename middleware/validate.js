const log  = require('../startup/logger');
const ApiError = require('../utils/apiError');


module.exports= function (func) {
    return (req,res,next)=>{
        const {error}=  func(req.body)
        console.log("#####");
        console.log(req.body);
        console.log("#####");

        if(error)return res.status(400).json({error:error.details[0].message});
        next()
    }
}
//