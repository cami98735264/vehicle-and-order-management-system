// middlewares/fileUpload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // Almacena el archivo en la memoria como buffer

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado. Solo se permite el formato PDF.'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de tamaño de 5 MB
});

module.exports = upload;
