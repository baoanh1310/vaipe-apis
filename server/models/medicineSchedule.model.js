import mongoose from 'mongoose'

const MedicineScheduleSchema = new mongoose.Schema({
    // drugs: {
    //     type: [mongoose.Schema.Types.ObjectId], // list drugId
    //     required: 'Medicine Schedule info is required'
    // },
    created: {
        type: Date,
        default: Date.now
    },
    symptoms: {
        type: String,
    },
    diagnose: {
        type: String,
    },
    img_path: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('MedicineSchedule', MedicineScheduleSchema)
