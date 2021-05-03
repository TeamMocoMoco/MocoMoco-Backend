import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'

const s3 = new AWS.S3({
  accessKeyId: process.env.LOVE_S3_ID,
  secretAccessKey: process.env.LOVE_S3_PW,
})

const S3storage = multerS3({
  s3,
  bucket: "",
  key(req, file, cb) {
    cb(null, `original/${Date.now()}${path.basename(file.originalname)}`)
  },
})

const serverStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/")
  },
  filename(req, file, cb) {
    cb(null, `/${Date.now()}${path.basename(file.originalname)}`)
  },
})


const upload = multer({
  storage: S3storage,
})
