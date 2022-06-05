import mongoose from 'mongoose'

const DrugTakenHistorySchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    date: {
        type: Date
    },
    drugTakenInfoId: {
        type: mongoose.Types.ObjectId,
        ref: "DrugTakenInfo"
    },
    weekDayId: {
        type: mongoose.Types.ObjectId,
        ref: "WeekDay"
    },
    takenTimeId: {
        type: mongoose.Types.ObjectId,
        ref: "TakenTime"
    }
})

export default mongoose.model('DrugTakenHistory', DrugTakenHistorySchema)