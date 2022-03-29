import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
  
const upload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + './../assets/imgs')
        },
        filename: (req, file, cb) => {
            cb(null, req.profile._id + '-' + uuidv4().toString() + '-' + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Invalid mime type!')
        cb(error, isValid)
    }
})

export default upload