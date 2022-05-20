import mongoose from 'mongoose'

const NotiSchema = new mongoose.Schema({
    drugs: {
        type: [mongoose.Schema.Types.ObjectId], // list drugId
        required: 'Drug info is required'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    time: {
        type: Date,
        default: Date.now
    },
    delay_time: {
        type: Number, // e.g. user want to take medicine after notification 15 minutes
        default: 0
    }
})

export default mongoose.model('Notification', NotiSchema)