import mongoose from 'mongoose'

const MedicineScheduleSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('MedicineSchedule', MedicineScheduleSchema)