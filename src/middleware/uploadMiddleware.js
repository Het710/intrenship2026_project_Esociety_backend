const multer=require('multer')

const storage=multer.diskStorage({
    destination:"./uploads",
    filename:(req,filename,cb)=>{
        cb(null,filename.originalname)
    }
})

const upload=multer({
    storage:storage
})

module.exports=upload