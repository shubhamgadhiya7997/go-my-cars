const { InternalServerError, BadRequest } = require("../Response/response");

 const validateImage = (req, res, next) => {
    try {

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!req.files || req.files.length === 0) {
            return BadRequest(res, "No files uploaded.");
        }
        const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));

        if (invalidFiles.length > 0) {
            return BadRequest(res, "Unsupported file type(s). Only JPG and PNG images are allowed.");
        }else{
            next()
        }



    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = validateImage;