require("express-async-errors")
const winston = require("winston")
//require("winston-mongodb")





module.exports = winston.createLogger({
    transports: [
        //new winston.transports.File({ filename: "log.log", level: "error" }),
        // new  winston.transports.MongoDB({db:"mongodb://localhost/vidly",level:"error"}),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
  /*     exceptionHandlers: [
        //new winston.transports.File({ filename: 'exceptions.log' })
        //new winston.transports.Console({})
    ],
    rejectionHandlers: [
        //new winston.transports.File({ filename: 'rejection.log' })
      //  new winston.transports.Console()

    ] ,  */
    exitOnError: false

})

