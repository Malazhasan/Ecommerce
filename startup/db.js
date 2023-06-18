const m=require("mongoose")
const log = require("./logger")

module.exports=()=>{
    m.connect("mongodb://localhost/ecommerc")
    .then(() => log.info(`connected to Ecommerce DB`))

}