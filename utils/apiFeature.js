class ApiFeature{
    constructor(mongooseQuery,req_query,req_body){
        this.mongooseQuery=mongooseQuery;
        this.req_query=req_query
        this.req_body=req_body
        this.model=mongooseQuery.modelName
    }

    filter(){

         let populate=''
        if(this.model==="Product")populate={path:"category",select:"name -_id"} 
        
        let query = { ...this.req_query }
     /*    console.log("query ====>");
        console.log(query);
        console.log("req_query ====>");
        console.log(this.req_query); */
        const exclude = ['page', 'sort', 'fields', 'limit','keyword']
        exclude.forEach(e => delete query[e])
        query = JSON.stringify(query)

        query = query.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        query = JSON.parse(query)
        console.log(this.req_body.filter);
        if(this.req_body.filter)query={...query,...this.req_body.filter}
        console.log(query)
        this.mongooseQuery=this.mongooseQuery.find(query)/* .populate(populate) */
        return this
    }

    sort(){
        if (this.req_query.sort) {
            const sortBy = this.req_query.sort.replaceAll(',', ' ')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
          }

          return this
    }


    limitFields(){
        if (this.req_query.fields) {
            const fields = this.req_query.fields.replaceAll(',', ' ')
            console.log("fields ====> "+fields)
            this.mongooseQuery = this.mongooseQuery.select(fields)
          }
          return this
    }

    search(){


        if (this.req_query.keyword) {
            const query={}
            if(this.model==="Product"){
                query.$or=[
                    {title:{$regex:this.req_query.keyword , $options:"i"}},
                    {description:{$regex:this.req_query.keyword ,$options:"i"}}
                  ]
                /*  this.mongooseQuery = this.mongooseQuery.or([
                        {title:{$regex:this.req_query.keyword , $options:"i"}},
                        {description:{$regex:this.req_query.keyword ,$options:"i"}}
                    ])*/
                    this.mongooseQuery = this.mongooseQuery.find(query)

            }
            else{
                query.$or=[
                    {name:{$regex:this.req_query.keyword , $options:"i"}},
                  ]
                    this.mongooseQuery = this.mongooseQuery.find(query)
            }
            
           }
           return this
    }


    pagination(countOfPages){
        const page = this.req_query.page * 1 || 1;
        const limit = this.req_query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        const endIndex=page*limit
        const pagination ={}
        pagination.currentPage=page;
        pagination.limit=limit;
        pagination.numberOfPages=Math.ceil(countOfPages/limit);
        if(endIndex<countOfPages)pagination.next=page+1;
        if(skip>0)pagination.prev=page-1;
        this.paginationResult=pagination

        this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit)
        return this
    }
}


module.exports=ApiFeature

