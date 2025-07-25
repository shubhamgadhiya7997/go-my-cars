const { getDataByPaginate } = require("../../common/common");
const LocationModel = require("../../model/location");
const { SuccessCreated, BadRequest, InternalServerError, SuccessOk } = require("../../Response/response");

const getLocation = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        if (req.query.name) {
            aggregate_options.push({
                $match: {
                    name: { $regex: req.query.name, $options: 'i' },
                },
            });
        }
        if (req.query.isActive == "true") {
            aggregate_options.push({
                $match: { isActive: true }
            })
        }
        if (req.query.isActive == "false") {
            aggregate_options.push({
                $match: { isActive: false }
            })
        }


        const aggregateQuery = LocationModel.aggregate(aggregate_options);
        const loationdetail = await LocationModel.aggregatePaginate(aggregateQuery, options);

        return SuccessOk(res, "Location fetched successfully", loationdetail);
    } catch (error) {
        console.error("Error fetching location:", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}


const postLocation = async (req, res) => {
    try {
        const { name, isActive } = req.body;

        if (!name) {
            return BadRequest(res, "Location name is required");
        }
        const trimmed = name.trim();
        const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

        const existingLocation = await LocationModel.findOne({
            name: { $regex: `^${formattedName}$`, $options: "i" },
        });

        if (existingLocation) {
            return BadRequest(res, "Location already added");
        }

        const locationData = new LocationModel({ name: formattedName, isActive });
        await locationData.save();

        return SuccessCreated(res, "Location added successfully", locationData);
    } catch (error) {
        console.error("Error adding location:", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
};



const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, isActive } = req.body;
        if (!name) {
            return BadRequest(res, "Location name is required");
        }
        const trimmed = name.trim();
        const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

        const existingLocation = await LocationModel.findOne({
            name: { $regex: `^${formattedName}$`, $options: "i" },
            _id: { $ne: id }
        });

        if (existingLocation) {
            return BadRequest(res, "Location already added");
        }
        const updatedLocation = await LocationModel.findByIdAndUpdate(
            id,
            { name: formattedName, isActive },
            { new: true }
        );

        if (!updatedLocation) {
            return NotFound(res, "Location not found");
        }

        return SuccessOk(res, "Location updated successfully", updatedLocation);

    } catch (error) {
        console.error("Error updating location:", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}
const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedata = await LocationModel.findByIdAndDelete(id);
        return SuccessOk(res, "Location deleted successfully", deletedata)
    } catch (error) {
        console.error("Error updating location:", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

const getLocationId = async (req, res) => {
    try {
        const id = req.params.id;
        const locationData = await LocationModel.findById(id)
        return SuccessOk(res, "Location get successfully.", locationData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const allLocation = async (req, res) => {
    try {
        const locations = await LocationModel.find(
            { isActive: true },
            { name: 1, _id: 0 }
        );

        const locationNames = locations.map(loc => loc.name);

        return SuccessOk(res, "Location names fetched successfully.", locationNames);
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
};


module.exports = { getLocation, postLocation, updateLocation, deleteLocation, getLocationId, allLocation }