const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];

        const fileName =
            `IMG-${Date.now()}_${Math.floor(Math.random() * 1E10)}.${ext}`;

        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image format, only images allowed'));
    }
};

const limits = {
    fileSize: 1024 * 1024 * 5
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;
module.exports.upload = upload;
