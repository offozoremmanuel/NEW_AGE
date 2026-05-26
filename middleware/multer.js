const multer = require('multer')
const path = require('path')

exports.upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    }),
    limits: {
        fileSize: 1024 * 1024 
    },
    fileFilter: (req, file, cb)=>{
        if (!file.mimetype.startsWith('image/')){
            cb(new Error('Only image files are allowed'))
        }else {
            cb(null, true)
        }
    }
})
