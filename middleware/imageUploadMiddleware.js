
const multer=require("multer");
const { resolve } = require('path');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/apiError');


exports.uploadImage=(field,folder)=>{
//Disk Storage methode
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
  console.log(folder);

      cb(null,resolve(__dirname,'../','uploads/'+folder))
    },
    filename: function (req, file, cb) {
      const ext=file.mimetype.split('/')[1]
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename=file.fieldname + '-' + uuidv4()+'-'+Date.now()+'.'+ext
      if (field==="profileImg") {
        req.body.profileImg=filename
      } else {
        req.body.image=filename
      }
      
      cb(null,filename )
    }
  }) 

  //Memory Storage for image proccessing
 // const storage = multer.memoryStorage()
  
  function fileFilter (req, file, cb) {
    //console.log(file);
    //console.log(file.mimetype.startsWith("image"));
    if(file.mimetype.startsWith("image")) cb(null, true)
    else cb(new ApiError("file is not image",400),false)
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
  
    // To reject this file pass `false`, like so:
   // cb(null, false)
  
    // To accept the file pass `true`, like so:
   
  
    // You can always pass an error if something goes wrong:
    
  
  }
  const upload = multer({ storage,fileFilter })
  return upload.single(field)
}




exports.multiuploadImage=(fields,folder)=>{
  //Disk Storage methode



   const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null,resolve(__dirname,'../','uploads/'+folder))
      },
      filename: function (req, file, cb) {
       /*  console.log("#####");
        console.log(req.body);
        console.log("#####"); */
        

        let filename=""
        const ext=file.mimetype.split('/')[1]
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        if(file.fieldname==="imageCover"){
         filename='cover' + '-' + uuidv4()+'-'+Date.now()+'.'+ext
        req.body.imageCover=filename
        }
       if(file.fieldname==="images"){
        filename=file.fieldname + '-' + uuidv4()+'-'+Date.now()+'.'+ext
       }
       
       
       //console.log(list);
        cb(null,filename )
        
      }
    }) 
  
    //Memory Storage for image proccessing
   // const storage = multer.memoryStorage()
    
    function fileFilter (req, file, cb) {
      //console.log(file);
  
      //console.log(req.files.imageCover[0]);
      //console.log(file.mimetype.startsWith("image"));
      if(file.mimetype.startsWith("image")) cb(null, true)
      else cb(new ApiError("file is not image",400),false)
      // The function should call `cb` with a boolean
      // to indicate if the file should be accepted
    
      // To reject this file pass `false`, like so:
     // cb(null, false)
    
      // To accept the file pass `true`, like so:
     
    
      // You can always pass an error if something goes wrong:
      
    
    }
    const upload = multer({ storage,fileFilter })
  
    return upload.fields(fields)
  }