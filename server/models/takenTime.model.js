import mongoose from 'mongoose'

const TakenTimeSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    hour: {
        type: Number
    },
    minute: {
        type: Number
    }
})

export default mongoose.model('TakenTime', TakenTimeSchema)