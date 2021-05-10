import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
})

const S3storage = multerS3({
  s3,
  bucket: process.env.BUCKET_NAME || "test",
  contentType: multerS3.AUTO_CONTENT_TYPE,
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

export default upload