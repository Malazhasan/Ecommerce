const m = require("mongoose")
const ApiError = require("../utils/apiError")

module.exports=function (req,res,next) 
{
    if(req.params.id&&!m.Types.ObjectId.isValid(req.params.id))return res.status(400).json({error:"invalid id"})
    if(req.params.productId&&!m.Types.ObjectId.isValid(req.params.productId))return res.status(400).json({error:"invalid id"})

    next()
    
}