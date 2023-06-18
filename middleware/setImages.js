module.exports=function (req,res,next) {
  
    if(req.files.images){
        req.body.images=[]
    req.files.images.forEach(element => {
        req.body.images.push(element.filename)
    });
}
next()
}