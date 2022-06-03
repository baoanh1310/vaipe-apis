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
    },
    beforeMeal: {
        type: Number, // 0: before meal, 1: after meal, 2: not specific
    },
    drugTakenInfo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DrugTakenInfo"
        }
    ]
})

export default mongoose.model('TakenTime', TakenTimeSchema)