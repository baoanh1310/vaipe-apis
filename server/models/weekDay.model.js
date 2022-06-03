import mongoose from 'mongoose'

const WeekDaySchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    weekDay: {
        type: Number
    }
})

export default mongoose.model('WeekDay', WeekDaySchema)