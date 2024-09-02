const multer = require('multer');
const path = require('path');
const fs = require('node:fs');

const upload = multer({
    limits: {
        fileSize: 1048576,  // 1 mb in bytes
        files: 7
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const y = new Date().getFullYear();
            const dir = path.join('public', 'media', y.toString());
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            let name = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`;
            cb(null, name);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            return cb(undefined, true);
        }
        cb(new Error("File should be image in png, jpg and jpeg format. Try again!"));
    }
});

const uploadFiles = upload.fields([{ name: 'featured', maxCount: 1 }, { name: 'gallery', maxCount: 6 }]);

const handleMulterError = (req, res, next) => {
    return uploadFiles(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large. Maximum allowed size is 1MB.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next()
    })
}
module.exports = handleMulterError;