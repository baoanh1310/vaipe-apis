import mongoose from 'mongoose'

const DrugTakenInfoSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    drugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drug"
    },
    medicineScheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicineSchedule"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    numberPill: {
        type: Number,
        default: 1
    },
    drugImage: {
        type: String
    },
    prefer: {
        type: Number, // 0: before meal; 1: after meal; 2: doesn't matter
    },
    weekDays: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WeekDay"
        }
    ],
    takenTimes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakenTime"
        }
    ]
})

export default mongoose.model('DrugTakenInfo', DrugTakenInfoSchema)