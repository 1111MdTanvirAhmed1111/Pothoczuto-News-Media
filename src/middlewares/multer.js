const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
 
      cb(null,  Date.now() + '-' + file.originalname.split(" ").join("") )
    }
  })
const uploadSingle = (file) => multer({ storage: storage }).single(file)
const uploadMulti  = multer({ 
  storage: storage,
}).fields([
  { name: 'mainImage', maxCount: 1 }, 
  { name: 'detailImages', maxCount: 3 } 
]);



  module.exports = {uploadSingle,uploadMulti}