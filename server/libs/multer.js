const multer = require('multer');

/**
 *
 * @param {Object} options
 * @param {Array.<String>} options.acceptFile ex: ['png', 'jpg']
 */
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "./../../assets/imgs");
    },
    filename: (req, file, callback) => {
        let filename = `${Date.now()}-productimg-${file.originalname}`;
        callback(null, filename);
    }
});

const upload = ({ acceptFile }) => {
    return multer({
        storage: diskStorage,
        fileFilter: (req, file, cb) => {
            if (acceptFile && acceptFile instanceof Array) {
                const ex = file.originalname.split(".").pop();
                if (!acceptFile.includes(ex)) {
                    return cb(new Error(`400:File must be formated ${acceptFile.join(", ")}`));
                }
            }
            cb(null, true)
        }
    })
}

module.exports = upload