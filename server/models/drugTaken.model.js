import mongoose from 'mongoose'

const DrugTakenSchema = new mongoose.Schema({
    drug: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drug"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    time: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('DrugTaken', DrugTakenSchema)