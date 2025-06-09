const banner = require("../../model/carBanner");
const fs = require('fs');
const path = require('path');
const { BadRequest, SuccessCreated, InternalServerError, NotFound, SuccessOk } = require("../../Response/response");
const { getDataByPaginate } = require("../../common/common");

const addCarImage = async (req, res) => {
    try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!req.files || req.files.length === 0) {
            return BadRequest(res, "No files uploaded.");
        }
        const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));

        if (invalidFiles.length > 0) {
            return BadRequest(res, "Unsupported file type(s). Only JPG and PNG images are allowed.");
        }

        const imagePaths = req.files.map(file => file.filename);
        console.log("imagePaths", imagePaths);



        const cardata = new banner({ carImage: imagePaths, isSelected: req?.body?.isSelected })
        await cardata.save();
        return SuccessCreated(res, "CarBanner added successfully.", cardata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const getCarImageList = async (req, res) => {
    try {
        const cardetail = await banner.find({isSelected: true});
        return SuccessOk(res, "CarBanner get successfully.", cardetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const getCarImage = async (req, res) => {
    try {
         const { aggregate_options, options } = getDataByPaginate(req, '');
                   
                  
                   const aggregateQuery = banner.aggregate(aggregate_options);
                   const userdetail = await banner.aggregatePaginate(aggregateQuery, options);
                   return SuccessOk(res, "CarBanner get successfully.", userdetail)
           
       

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const updateCarImage = async (req, res) => {
    try {
        const carId = req.params.id;
        const { imageToRemove, isSelected } = req.body || {};
        console.log("isSelected", isSelected)
        const existingCar = await banner.findById(carId);
        // console.log("existingCar.isSelected", existingCar.isSelected)
        if (!existingCar) {
            return NotFound(res, "Carbanner not found",)
        }

        if (imageToRemove) {
            existingCar.carImage = existingCar.carImage.filter(img => img !== imageToRemove);


            if (imageToRemove) {
                const imagesToRemove = imageToRemove.split(','); // Convert string to array

                // Filter out the images from carImage array
                existingCar.carImage = existingCar.carImage.filter(
                    img => !imagesToRemove.includes(img)
                );

                // Delete each image from the filesystem
                imagesToRemove.forEach(img => {
                    const imgPath = path.join(__dirname, '../../uploads', img);
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                        console.log("Deleted:", imgPath);
                    } else {
                        console.warn("Not found:", imgPath);
                    }
                });
            }

        }


        console.log("existingCar.carImage", existingCar.carImage)
        if (req.files && req.files.length > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));
            if (invalidFiles.length > 0) {
                return BadRequest(res, "Unsupported file type(s). Only JPG and PNG images are allowed.");
            }

            const newImagePaths = req.files.map(file => file.filename);

            existingCar.carImage = [
                ...(existingCar.carImage || []),
                ...newImagePaths
            ];
        }

        existingCar.isSelected = isSelected ?? false;


        Object.assign(existingCar);


        const updatedCar = await existingCar.save();
        return SuccessOk(res, "Carbanner updated successfully.", updatedCar)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
};

const deleteCarImage = async (req, res) => {
    try {
        const carId = req.params.id;
        const carToDelete = await banner.findById(carId);

        if (!carToDelete) {
            return NotFound(res, "Carbanner not found",)
        }
        console.log("carToDelete", carToDelete)
        if (carToDelete.carImage && Array.isArray(carToDelete.carImage)) {
            carToDelete.carImage.forEach(filename => {
                const imagePath = path.join(__dirname, '../../uploads', filename);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
        await banner.findByIdAndDelete(carId);
        return SuccessOk(res, "Carbanner deleted successfully.")

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
};

const getCarImageId = async (req,res) => {

         try {
                const bannerID = req.params.id;
                const bannerdata = await banner.findOne({ _id: bannerID });
                return SuccessOk(res, "Banner find successfully.", bannerdata)
        
            } catch (error) {
                console.log("err", error);
                return InternalServerError(res, "Internal Server Error", error.message);
            }
}

module.exports = { addCarImage, getCarImage,getCarImageId, getCarImageList, updateCarImage, deleteCarImage }