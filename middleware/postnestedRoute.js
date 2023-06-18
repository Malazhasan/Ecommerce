module.exports=function (req,res,next) {
    if(req.params.id) req.body.category=req.params.id
    if(req.params.productId) req.body.product=req.params.productId

    next()
  }
