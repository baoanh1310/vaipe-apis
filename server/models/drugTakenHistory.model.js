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
        type: mongoose.Schema.Types.ObjectId,
        ref: "DrugTakenInfo"
    },
    // weekDayId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "WeekDay"
    // },
    takenTimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TakenTime"
    },
    wasTaken: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model('DrugTakenHistory', DrugTakenHistorySchema)