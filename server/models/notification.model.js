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
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    eat_time: {
        // before or after eat: {0: before, 1: after}
        type: Number,
        default: 0,
    },
    time: {
        type: Date,
        default: Date.now
    },
    number_pill: {
        type: Number, // number of pill to take each time
        default: 1
    },
    delay_time: {
        type: Number, // e.g. user want to take medicine after notification 15 minutes
        default: 0
    },
    created: {
        type: Date,
    },
    updated: {
        type: Date
    }
})

export default mongoose.model('Notification', NotiSchema)