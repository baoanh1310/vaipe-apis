import mongoose from 'mongoose'

const DrugTakenInfoSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date
    },
    drugTakenInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DrugTakenInfo"
    },
    weekDay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeekDay"
    },
    takenTime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TakenTime"
    }
})

export default mongoose.model('DrugTakenHistory', DrugTakenInfoSchema)