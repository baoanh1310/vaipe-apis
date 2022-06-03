import mongoose from 'mongoose'

const WeekDaySchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    weekDay: {
        type: Number
    },
    drugTakenInfo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DrugTakenInfo"
        }
    ]
})

export default mongoose.model('WeekDay', WeekDaySchema)