// ini di middlewarenya

const util = require('util');
const multer = require("multer");
const path = require('path');

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(`${__dirname}../../upload/images`));
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            let message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        let filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

let uploadFiles = multer({ storage: storage }).array("multi-files", 5);
let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

// ini di controllernya

const upload = require('../../middleware/uploadImages');
        try {
            await upload(req, res);
            
            const images = req.files;
    
            images.forEach(element => {
                console.log(element);
            });
        
            if (req.files.length <= 0) {
                return res.send(`You must select at least 1 file.`);
            }
        
            return res.send(`Files has been uploaded.`);
        } catch (error) {
            console.log(error);
        
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send("Too many files to upload.");
            }
            return res.send(`Error when trying upload many files: ${error}`);
        }
