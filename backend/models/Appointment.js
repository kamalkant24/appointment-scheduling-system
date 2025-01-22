const mongoose = require('mongoose')


const AppointmentSchema = new mongoose.Schema({

  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient",
    required:true,
  },
  doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor",
    required:true,
  },
  slot:{
    type: String,
    required: [true, "Please provide slot"],
    trim: true
  },
  issue:{
    type:String,
    default: "none",
    trim:true,
  },
  prescription: {
    type: String,
    default: "none",
    trim: true
  },
  tokenNo:{
    type:String,
    default:"-1",
    trim:true,
  },
  date:{
    type: String,
    required: [true, "Please provide date"],
    trim: true
  },
  time:{
    type: String,
    required: [true, "Please provide time"],
    trim: true
  },
},
  { timestamps: true }
);

// Pre-save hook to ensure sequential tokenNo generation
AppointmentSchema.pre('save', async function (next) {
  const appointment = this;

  // Only generate tokenNo if it hasn't already been set
  if (appointment.isNew || appointment.tokenNo === '-1') {
    try {
      // Fetch the latest token number for the doctor and date
      const lastAppointment = await mongoose
        .model('Appointment')
        .findOne({ date: appointment.date, doctor: appointment.doctor })
        .sort({ tokenNo: -1 }) // Sort in descending order by tokenNo to get the highest token
        .exec();

      const lastToken = lastAppointment ? parseInt(lastAppointment.tokenNo, 10) : 0;

      // Assign the next token number
      appointment.tokenNo = (lastToken + 1).toString();

      next();
    } catch (err) {
      next(err); // Pass the error to Mongoose if something goes wrong
    }
  } else {
    next();
  }
});
module.exports = mongoose.model('Appointment', AppointmentSchema)