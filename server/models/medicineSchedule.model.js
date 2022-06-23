import mongoose from 'mongoose'

const MedicineScheduleSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    symptoms: {
        type: String,
    },
    diagnose: {
        type: String,
    },
    medicineScheduleImage: {
        type: String
    },
    medicineScheduleName: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('MedicineSchedule', MedicineScheduleSchema)
