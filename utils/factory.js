const  slugify  = require("slugify")
const ApiFeature = require("./apiFeature")
const ApiError = require("./apiError")

module.exports.getAll=(model)=>{
    return async (req, res) => {
      console.log(req.body);
      const numOfDocs=await model.countDocuments()
        const {mongooseQuery,paginationResult}=new ApiFeature(model,req.query,req.body)
                                            .filter().limitFields().pagination(numOfDocs).search().sort()
       // console.log(mongooseQuery)
        const docs= await mongooseQuery
        //res.send(docs)
        res.status(200).json({ results: docs.length,paginationResult, data: docs });

}}

module.exports.createOne=(model)=>{
    return async (req, res) => {
      //console.log(req.body);
        if(model.modelName==="Product"){
            req.body.slug=slugify(req.body.title)
        }
        else{
            req.body.slug=slugify(req.body.name)
        }
        const doc = await model.create(req.body);
        res.status(201).json({ data: doc });
      }

}

module.exports.getOne=(model,populateoptions="")=>{
    return  async (req, res,next) => {
        const { id } = req.params;
        const doc = await model.findById(id).populate(populateoptions);
        if (!doc) {
         return  next(new ApiError(`No doc for this id ${id}`, 404));
        }
        res.status(200).json({ data: doc });
      }
}

module.exports.updateOne=(model)=>{
    return  async (req, res,next) => {
      
        const { id } = req.params;
        if(model.modelName==="Product"&&req.body.title){
          req.body.slug=slugify(req.body.title)
      }
     /*  else{
          req.body.slug=slugify(req.body.name)
      } */
  if(req.body.name){
    req.body.slug=slugify(req.body.name)

  }
        const doc = await model.findOneAndUpdate(
          { _id: id },
          { ...req.body},
          { new: true }
        );
  
        if (!doc) {
          return next( new ApiError(`No doc for this id ${id}`, 404));
        }
        res.status(200).json({ data: doc });
      }
}

module.exports.deleteOne=(model)=>{

    return  async (req, res,next) => {
        const { id } = req.params;
        const doc = await model.findByIdAndDelete(id);
        if (!doc) {
          return next(new ApiError(`No doc for this id ${id}`, 404)) ;
        }
        res.status(204).send("delete completed");
      }
}