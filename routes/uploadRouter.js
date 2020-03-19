const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const authenticate = require('../authenticate')

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'public/images')
    
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname,)
  }
})

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) return cb(new Error('You can only upload image files'), false)
  cb(null, true)
}

const upload = multer({storage: storage, imageFileFilter: imageFileFilter})

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
  .get(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('GET operation not supported on /imageUpload')
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /imageUpload')
  })
  .delete(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('DELETE operation not supported on /imageUpload')
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.json(req.file)
  })

module.exports = uploadRouter
