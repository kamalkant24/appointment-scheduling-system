const { StatusCodes } = require('http-status-codes')

const Models = require('../models/index')
const Errors = require('../errors/index')


const create = async (req, res) => {

    req.body["date"] = req.body["slot"].split(' ')[0]
    req.body["time"] = req.body["slot"].split(' ')[1]

    console.log(req.body)

    const appointment = await Models.Appointment.create({ ...req.body })
    
    return res.status(StatusCodes.CREATED).json({

        appointment,
        isValid: true,
    })
}

const list = async (req, res) => {

    const { id, type, date } = req.body

    console.log({id,type, date})

    let appointments = []

    if(type==="patient")
    {
        let filterObj = {}
        filterObj.patient = id

        if(date)
        filterObj.date = date

        appointments = await Models.Appointment.find(filterObj).populate('patient').populate('doctor')
    }
    else if(type==="doctor")
    {
        let filterObj = {}
        filterObj.doctor = id

        if(date)
        filterObj.date = date

        console.log(filterObj)
    
        appointments = await Models.Appointment.find(filterObj).populate('patient').populate('doctor')
    }
    else
    {
        appointments = await Models.Appointment.find({}).populate('patient').populate('doctor')
        console.log(appointments)
    }

    console.log(appointments)
    
    return res.status(StatusCodes.OK).json({

        appointments,
        nbHits: appointments.length,
        isValid: true,
    })
}


// const cancel = async (req, res) => {

//     const { appointmentID } = req.body

//     let result = Models.Appointment.findOneAndDelete(appointmentID);

//     // const page = Number(req.query.page) || 1;
//     // const limit = Number(req.query.limit) || 10;
//     // const skip = (page - 1) * limit;

//     // result = result.skip(skip).limit(limit);

    

//     return res.status(StatusCodes.OK).json({

//         isValid: true 
    
//     });

// }


const cancel = async (req, res) => {

    const { appointmentID } = req.body;

    // Ensure the appointmentID is provided
    if (!appointmentID) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Appointment ID is required" });
    }

    try {
        // Find and delete the appointment using the provided appointmentID
        const result = await Models.Appointment.findOneAndDelete({ _id: appointmentID });

        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Appointment not found" });
        }

        // Successfully deleted the appointment
        return res.status(StatusCodes.OK).json({
            isValid: true,
            message: "Appointment successfully deleted"
        });

    } catch (error) {
        // Handle any errors that may occur during deletion
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error deleting appointment",
            error: error.message
        });
    }

}



const update = async (req, res) => {

    const { appointmentID, slot } = req.body;

    // Ensure the 'slot' field is provided
    if (!slot) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Slot is required" });
    }

    // Split the slot into date and time
    const [date, time] = slot.split(' ');

    // Prepare the filter for finding the appointment
    const filter = { _id: appointmentID };

    // Prepare the update data, including the new date and time
    const updateData = { ...req.body, date, time };

    try {
        // Update the appointment and return the updated appointment
        const appointment = await Models.Appointment.findOneAndUpdate(filter, updateData, { new: true });

        if (!appointment) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Appointment not found" });
        }

        return res.status(StatusCodes.OK).json({
            appointment,
            isValid: true,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating appointment",
            error: error.message
        });
    }
}


module.exports = {
    
    create,
    update,
    cancel,
    list
}